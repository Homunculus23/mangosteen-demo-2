import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { FormItem } from "../../shared/Form";
import s from "./Charts.module.scss";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { Bars } from "./Bars";
import { http } from "../../shared/Http";
import { Time } from "../../shared/time";
import { NoData } from "../../shared/NoData";

const DAY = 24 * 3600 * 1000;
// 折线图数据
type Data1Item = { happen_at: string; amount: number };
type Data1 = Data1Item[];
// 饼图数据
type Data2Item = { tag_id: number; tag: Tag; amount: number };
type Data2 = Data2Item[];
export const Charts = defineComponent({
  props: {
    startDate: {
      //这里类型限制日期或字符串都可以，但字符串更泛用，且转换简单
      type: String as PropType<string>,
    },
    endDate: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const kind = ref("expenses");
    const data1 = ref<Data1>([]);
    // 确认所有数据是否为空，是则用"开始记账"替代
    const hasData = ref(false);
    // 将对象数组转化为二维数组，以便复制给 echarts
    const betterData1 = computed<[string, number][]>(() => {
      // 在 startDate 或 endDate 其一为空时直接 return 空数据
      if (!props.startDate || !props.endDate) return [];
      const array = [];
      // 获取 startDate 和 endDate 的时间戳差值
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime();
      // Day 为一天总秒数，n 为  startDate 和 endDate 的相差天数
      const n = diff / DAY + 1;
      // 用于记录后端数据下标
      let data1Index = 0;
      // 如果不确定是 i<n 还是 i<=n：let i=0时，i<n 循环 n 次，i <= n 循环 n+1 次
      return Array.from({ length: n }).map((_, i) => {
        // 获取当天的时间戳，同时以 T00:00:00.000+0800 纠正为北京时区（若以默认的格林威治时间为准，不符合我们的用户需求）
        const time = new Time(props.startDate + "T00:00:00.000+0800").add(i, "day").getRaw().getTime();
        // if: data1 里面所需数据存在 && 后端第 data1Index 个数据的时间戳，和当前操作的时间戳相等
        // new Date(time).toISOString() 是标准时间格式（计算时区）
        // 添加后端数据
        // 后端数据下标后移一位
        const item = data1.value[0];
        const amount = item && new Date(item.happen_at).getTime() === time ? data1.value.shift()!.amount : 0;
        return [new Date(time).toISOString(), amount];
      });
    });
    const fetchData1 = async () => {
      const response = await http.get<{ groups: Data1; summary: number }>(
        "/items/summary",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          kind: kind.value,
          group_by: "happen_at",
        },
        {
          _mock: "itemSummary",
        }
      );
      data1.value = response.data.groups;
      if (data1.value.length !== 0) hasData.value = true;
    };
    onMounted(fetchData1);
    watch(() => kind.value, fetchData1);
    // data2
    const data2 = ref<Data2>([]);
    // 饼图
    const betterData2 = computed<{ name: string; value: number }[]>(() =>
      data2.value.map((item) => ({
        name: item.tag.name,
        value: item.amount,
      }))
    );
    // 条形图
    //betterData3求取各个 amount 占总收/支的百分比，并添加到percent属性中
    const betterData3 = computed<{ tag: Tag; amount: number; percent: number }[]>(() => {
      const total = data2.value.reduce((sum, item) => sum + item.amount, 0);
      return data2.value.map((item) => ({
        ...item,
        //显示的百分比不需要小数，Math.round四舍五入
        percent: Math.round((item.amount / total) * 100),
      }));
    });
    const fetchData2 = async () => {
      const response = await http.get<{ groups: Data2; summary: number }>(
        "/items/summary",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          kind: kind.value,
          group_by: "tag_id",
        },
        {
          _mock: "itemSummary",
          _autoLoading: true,
        }
      );
      data2.value = response.data.groups;
      if (data2.value.length !== 0) hasData.value = true;
    };
    onMounted(fetchData2);
    watch(() => kind.value, fetchData2);
    return () => (
      <>
        {hasData.value ? (
          <>
            <div class={s.wrapper}>
              <FormItem
                label="类型"
                type="select"
                options={[
                  { value: "expenses", text: "支出" },
                  { value: "income", text: "收入" },
                ]}
                v-model={kind.value}
              />
              <LineChart data={betterData1.value} />
              <PieChart data={betterData2.value} />
              <Bars data={betterData3.value} />
            </div>
          </>
        ) : (
          <NoData />
        )}
      </>
    );
  },
});
