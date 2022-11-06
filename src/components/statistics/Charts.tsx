import { defineComponent, PropType } from "vue";
import s from './Charts.module.scss';
export const Charts = defineComponent({
    props:{
        startDate: {
            //这里类型限制日期或字符串都可以，但字符串更泛用，且转换简单
            type: String as PropType<string>,
            required: true
        },
        endDate: {
            type: String as PropType<string>,
            required: true
        },
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            <div class={s.wrapper}>
                图表
            </div>
        );
    }
})