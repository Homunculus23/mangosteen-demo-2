import { defineComponent, onMounted, ref } from "vue";
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
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>();
    const data = [
      ["2018-01-01T00:00:00.000+0800", 150],
      ["2018-01-02T00:00:00.000+0800", 230],
      ["2018-01-03T00:00:00.000+0800", 224],
      ["2018-01-04T00:00:00.000+0800", 218],
      ["2018-01-05T00:00:00.000+0800", 135],
      ["2018-01-06T00:00:00.000+0800", 147],
      ["2018-01-07T00:00:00.000+0800", 260],
      ["2018-01-08T00:00:00.000+0800", 300],
      ["2018-01-09T00:00:00.000+0800", 200],
      ["2018-01-10T00:00:00.000+0800", 300],
      ["2018-01-11T00:00:00.000+0800", 400],
      ["2018-01-12T00:00:00.000+0800", 500],
      ["2018-01-13T00:00:00.000+0800", 400],
      ["2018-01-14T00:00:00.000+0800", 300],
      ["2018-01-15T00:00:00.000+0800", 200],
      ["2018-01-16T00:00:00.000+0800", 100],
      ["2018-01-17T00:00:00.000+0800", 200],
      ["2018-01-18T00:00:00.000+0800", 300],
      ["2018-01-19T00:00:00.000+0800", 400],
      ["2018-01-20T00:00:00.000+0800", 500],
      ["2018-01-21T00:00:00.000+0800", 600],
      ["2018-01-22T00:00:00.000+0800", 700],
      ["2018-01-23T00:00:00.000+0800", 800],
      ["2018-01-24T00:00:00.000+0800", 900],
      ["2018-01-25T00:00:00.000+0800", 1000],
      ["2018-01-26T00:00:00.000+0800", 1100],
      ["2018-01-27T00:00:00.000+0800", 1200],
      ["2018-01-28T00:00:00.000+0800", 1300],
      ["2018-01-29T00:00:00.000+0800", 1400],
      ["2018-01-30T00:00:00.000+0800", 1500],
      ["2018-01-31T00:00:00.000+0800", 1600],
    ];
    onMounted(() => {
      if (refDiv.value === undefined) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(refDiv.value);
      console.log("LineChart");
      // 绘制图表
      myChart.setOption({
        ...echartsOption,
        series: [
          {
            data: data,
            type: "line",
          },
        ],
      });
    });
    return () => <div ref={refDiv} class={s.wrapper}></div>;
  },
});
