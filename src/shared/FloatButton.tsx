import { defineComponent, PropType } from "vue";
import { Icon, IconName } from "./Icon";
import s from "./FloatButton.module.scss";
export const FloatButton = defineComponent({
  props: {
    iconName: {
      type: String as PropType<IconName>,
      required: true, //我们期望props.name不支持undefined，必须写这一句
    },
  },
  setup: (props, context) => {
    return () => (
      //获取StartPage在引用FloatButton时的iconName
      <div class={s.floatButton}>
        <Icon name={props.iconName} class={s.icon} />
      </div>
    );
  },
});
