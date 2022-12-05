import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
import s from "./Charts.module.scss";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { Bars } from "./Bars";
import { http } from "../../shared/Http";
import { Time } from "../../shared/time";

const DAY = 24 * 3600 * 1000;
type Data1Item = { happen_at: string; amount: number };
type Data1 = Data1Item[];
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
    // 将对象数组转化为二维数组，以便复制给 echarts
    const betterData1 = computed<[string, number][]>(() => {
      // 在 startDate 或 endDate 其一为空时直接 return 空数据
      if (!props.startDate || !props.endDate) {
        return [];
      }
      const array = [];
      // 获取 startDate 和 endDate 的时间戳差值
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime();
      // Day 为一天总秒数，n 为  startDate 和 endDate 的相差天数
      const n = diff / DAY + 1;
      // 用于记录后端数据下标
      let data1Index = 0;
      // 如果不确定是 i<n 还是 i<=n：let i=0时，i<n 循环 n 次，i <= n 循环 n+1 次
      for (let i = 0; i < n; i++) {
        // 获取当天的时间戳，同时以 T00:00:00.000+0800 纠正为北京时区（若以默认的格林威治时间为准，不符合我们的用户需求）
        const time = new Time(props.startDate + "T00:00:00.000+0800").add(i, "day").getRaw().getTime();
        // if: data1 里面所需数据存在 && 后端第 data1Index 个数据的时间戳，和当前操作的时间戳相等
        if (data1.value[data1Index] && new Date(data1.value[data1Index].happen_at).getTime() === time) {
          // new Date(time).toISOString() 是标准时间格式（计算时区）
          // 添加后端数据
          array.push([new Date(time).toISOString(), data1.value[data1Index].amount]);
          // 后端数据下标后移一位
          data1Index += 1;
        } else {
          array.push([new Date(time).toISOString(), 0]);
        }
      }
      console.log(array);
      return array as [string, number][];
    });
    onMounted(async () => {
      const response = await http.get<{ groups: Data1; summary: number }>("/items/summary", {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        _mock: "itemSummary",
      });
      data1.value = response.data.groups;
    });
    return () => (
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
        <div>1</div>
        <LineChart data={betterData1.value} />
        <PieChart />
        <Bars />
      </div>
    );
  },
});
