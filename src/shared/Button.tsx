import { defineComponent, PropType } from "vue";
import s from "./Button.module.scss";

// interface Props{
//     onClick?: (e: MouseEvent) => void   //如果onClick后面不加问号，调用Button就必须传onClick
// }
export const Button = defineComponent({
    props: {
        onClick: {
            type: Function as PropType<(e: MouseEvent) => void>
        },
        level: {
            //TS的onClick级别较为严格
            //不同的按钮建议用不同的默认颜色
            type: String as PropType<'important' | 'normal' | 'danger'>,
            default: 'important'
        },
        type: {
            type: String as PropType<'submit' | 'button'>,
            default: 'button'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    //如果不想让button自动继承调用者的class和onClick，而是在Button页面完成功能，可以采用以下代码：
    //inheritAttrs: false,  //如果改为false，请参照第9课视频 创建 Button 组件 的24:30~29:00
    setup: (props, context) => {
        return () => (
            //props.level有'important'、'normal'、'danger'三个变量
            <button disabled={props.disabled} type={props.type} class={[s.button, s[props.level]]} onClick={props.onClick}>
                {context.slots.default?.()}
            </button>
        );
    }
})