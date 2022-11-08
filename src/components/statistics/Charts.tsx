import { defineComponent, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
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
        const category = ref('expenses')
        return () => (
            <div class={s.wrapper}>
                |{category.value}|
                <FormItem label='类型' type='select' options={[
                    { value: 'expenses', text: '支出'},
                    { value: 'income', text: '收入'},
                ]} v-model={category.value}/>
            </div>
        );
    }
})