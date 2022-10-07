import { defineComponent, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
import { InputPad } from "./InputPad";
import s from './ItemCreate.module.scss';
export const ItemCreate = defineComponent({
    props:{
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        //Tab的默认值是‘支出’
        const refKind = ref('支出')
        return () => (
            //注意：<MainLayout> 和上下花括号之间不能有空格，否则花括号中的内容将会被视为数组，无法变成插槽。
            <MainLayout>{
                {
                    icon: () => <Icon name="left" class={s.navIcon}/>,
                    title: () => '记一笔',
                    default: () => <>
                        {/* 网页第一次渲染时就将refKind.value赋予 update: 的 selected。
                        双向绑定事件，当回调参数与refKind.value不同时，将获取的回调参数赋予refKind.value，并将refKind.value赋予 update: 的 selected，该行为将使Tabs重新渲染。 */}
                        <Tabs v-model:selected={refKind.value} >
                            <Tab name="支出">
                                支出
                            </Tab>
                            <Tab name="收入">
                                收入
                            </Tab>
                        </Tabs>
                        {/* 用div为InputPad作定位 */}
                        <div class={s.inputPad_wrapper}>
                            <InputPad></InputPad>
                        </div>
                        
                    </>
                }
            }</MainLayout>
        )
    }
})