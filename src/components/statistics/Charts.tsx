import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
import s from "./Charts.module.scss";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { Bars } from "./Bars";
import { http } from "../../shared/Http";

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
    const betterData1 = computed(() => {
      return data1.value.map(
        // [time, money]
        (item) => [item.happen_at, item.amount] as [string, number]
      );
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
