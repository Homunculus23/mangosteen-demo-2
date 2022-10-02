import { defineComponent } from "vue";
import s from './Button.module.scss'
export const Button = defineComponent({
    //如果不想让button自动继承调用者的class和onClick，而是在Button页面完成功能，可以采用以下代码：
    //inheritAttrs: false,
    setup: (props, context) => {
        return () => (
            <button class={s.button}>
                {context.slots.default?.()}
            </button>
        );
    }
})