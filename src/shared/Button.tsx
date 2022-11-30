import { computed, defineComponent, PropType, ref } from "vue";
import s from "./Button.module.scss";

// interface Props{
//     onClick?: (e: MouseEvent) => void   //如果onClick后面不加问号，调用Button就必须传onClick
// }
export const Button = defineComponent({
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    level: {
      //TS的onClick级别较为严格
      //不同的按钮建议用不同的默认颜色
      type: String as PropType<"important" | "normal" | "danger">,
      default: "important",
    },
    type: {
      type: String as PropType<"submit" | "button">,
      default: "button",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 用于关闭自动沉默
    autoSelfDisabled: {
      type: Boolean,
      default: false,
    },
  },
  //如果不想让button自动继承调用者的class和onClick，而是在Button页面完成功能，可以采用以下代码：
  //inheritAttrs: false,  //如果改为false，请参照第9课视频 创建 Button 组件 的24:30~29:00
  setup: (props, context) => {
    // 长时间自我沉默，默认 false
    const selfDisabled = ref(false);
    // 为了防止快速点击按钮和网络延迟共同作用，或者触屏问题，导致同类请求多次发送引起bug，为所有按钮添加被点击后自我沉默0.3秒
    const _disabled = computed(() => {
      if (props.autoSelfDisabled === false) {
        return props.disabled;
      }
      // 检查 selfDisabled 真假
      if (selfDisabled.value) {
        return true;
      } else {
        // 如自我沉默为 false，返回 disabled
        return props.disabled;
      }
    });
    // 用自己的 onClick 取代 props.onClick
    const onClick = () => {
      props.onClick?.();
      // 激活自我沉默
      selfDisabled.value = true;
      // 0.3毫秒后自我沉默取消。测试时可调长时间
      setTimeout(() => {
        selfDisabled.value = false;
      }, 300);
    };
    return () => (
      //props.level有'important'、'normal'、'danger'三个变量
      <button
        disabled={_disabled.value}
        type={props.type}
        class={[s.button, s[props.level]]}
        onClick={onClick}
      >
        {context.slots.default?.()}
      </button>
    );
  },
});
