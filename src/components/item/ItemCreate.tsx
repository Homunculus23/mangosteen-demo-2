import { defineComponent, PropType } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import s from './ItemCreate.module.scss';
export const ItemCreate = defineComponent({
    props:{
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            //注意：<MainLayout> 和上下花括号之间不能有空格，否则花括号中的内容将会被视为数组，无法变成插槽。
            <MainLayout>{
                {
                    title: () => '记一笔',
                    icon: () => <Icon name="left" class={s.navIcon}/>,
                    default: () => <>
                        <div>main</div>
                    </>
                }
            }</MainLayout>
        )
    }
})