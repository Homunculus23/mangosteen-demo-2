import { defineComponent, PropType } from "vue";
import s from "./Center.module.scss";
const directionMap = {
  "-": "horizontal",
  "|": "vertical",
  horizontal: "horizontal",
  vertical: "vertical",
};
export const Center = defineComponent({
  props: {
    direction: {
      //如果有两个以上元素，支持根据方向自动调整样式，-或horizontal横向，|或vertical纵向
      type: String as PropType<"-" | "|" | "horizontal" | "vertical">,
      default: "horizontal", //添加默认值，防止出现undefined
    },
  },
  setup: (props, context) => {
    const extraClass = directionMap[props.direction];
    return () => (
      <div class={[s.center, extraClass]}>{context.slots.default?.()}</div>
    );
  },
});
