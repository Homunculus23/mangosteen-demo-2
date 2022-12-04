import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import s from "./LineChart.module.scss";
import * as echarts from "echarts";
import { Time } from "../../shared/time";
import { getMoney } from "../../shared/MoneyToString";
const echartsOption = {
  tooltip: {
    show: true,
    trigger: "axis",
    formatter: ([item]: any) => {
      const [x, y] = item.data;
      // getMoney 是在 MoneyToString 里额外抽离的一个函数。由于 eCharts 只能接收 js，只有这样才能让折线图的点显示详细金额。
      return `${new Time(new Date(x)).format("YYYY年MM月DD日")} ￥${getMoney(
        y
      )}`;
    },
  },
  grid: [{ left: 16, top: 20, right: 16, bottom: 20 }],
  // X轴属性
  xAxis: {
    type: "time",
    // boundaryGap 可以让左/右各自多显示一些时间。左 3% 让1月1号的数据可以显示出来的同时，尽可能美观。
    boundaryGap: ["3%", "0%"],
    // axisLabel 显示横坐标的详细时间
    axisLabel: {
      formatter: (value: string) => new Time(new Date(value)).format("MM-DD"),
    },
    axisTick: {
      alignWithLabel: true,
    },
  },
  // Y轴属性
  yAxis: {
    show: true,
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
      },
    },
    axisLabel: {
      show: false,
    },
  },
};

export const LineChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<[string, number][]>,
      required: true,
    },
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>();
    let chart: echarts.ECharts | undefined = undefined;
    onMounted(() => {
      if (refDiv.value === undefined) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      chart = echarts.init(refDiv.value);
      // 绘制图表
      chart.setOption({
        ...echartsOption,
        series: [
          {
            data: props.data,
            type: "line",
          },
        ],
      });
    });
    watch(
      () => props.data,
      () => {
        chart?.setOption({
          series: [
            {
              data: props.data,
            },
          ],
        });
      }
    );
    return () => <div ref={refDiv} class={s.wrapper}></div>;
  },
});
