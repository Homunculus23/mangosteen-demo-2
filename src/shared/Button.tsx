import { defineComponent } from "vue";
import s from './Button.module.scss';
interface Props{
    onClick?: (e: MouseEvent) => void   //如果onClick后面不加问号，调用Button就必须传onClick
}
export const Button = defineComponent<Props>({
    //如果不想让button自动继承调用者的class和onClick，而是在Button页面完成功能，可以采用以下代码：
    //inheritAttrs: false,  //如果改为false，请参照第9课视频 创建 Button 组件 的24:30~29:00
    setup: (props, context) => {
        return () => (
            <button class={s.button}>
                {context.slots.default?.()}
            </button>
        );
    }
})