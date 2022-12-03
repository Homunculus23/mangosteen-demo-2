import { defineComponent, PropType } from "vue";
const addZero = (n: number) => {
  const nString = n.toString();
  const dotIndex = nString.indexOf(".");
  if (dotIndex < 0) {
    return nString + ".00";
  } else if (nString.substring(dotIndex).length === 2) {
    return nString + "0";
  } else {
    return nString;
  }
};
export const MoneyToString = defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      // 如果不是必填，下面的 span 就没有可显示的内容
      required: true,
    },
  },
  setup: (props, context) => {
    // 函数首先接受一个数字 n ，然后将其 toString() 转化字符串
    return () => <span>{addZero(props.value / 100)}</span>;
  },
});
export const getMoney = (n: number) => {
  return addZero(n / 100)
}