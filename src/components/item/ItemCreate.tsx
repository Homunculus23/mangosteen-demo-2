import { defineComponent, onMounted, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { http } from "../../shared/Http";
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
        // Tab的默认值是‘支出’
        const refKind = ref('支出')
        // 发请求
        onMounted(async () =>{
            const response = await http.get<{resources: Tag[]}>('/tags', {
                kind: 'expenses',
                _mock: 'tagIndex'
            })
            // 由于代码异步执行，这里的 refExpensesTags 赋值必然晚于声明
            refExpensesTags.value = response.data.resources
        })
        // 本页面的接口，即使后端做出来了也不会有数据，我们终究要 Mock 一波假数据
        //.type 在JS以外的语言里通常是API，尽可能不要用 type 做key。最好用 kind 。 Tag 全局引用于 env.d.ts
        const refExpensesTags = ref<Tag[]>([])
        onMounted(async () =>{
            const response = await http.get<{resources: Tag[]}>('/tags', {
                kind: 'income',
                _mock: 'tagIndex'
            })
            refIncomeTags.value = response.data.resources
        })
        const refIncomeTags = ref<Tag[]>([])
        return () => (
            //注意：<MainLayout> 和上下花括号之间不能有空格，否则花括号中的内容将会被视为数组，无法变成插槽。
            <MainLayout class={s.layout}>{{
                icon: () => <Icon name="left" class={s.navIcon}/>,
                title: () => '记一笔',
                default: () => <>
                <div class={s.wrapper}>
                        {/* 网页第一次渲染时就将refKind.value赋予 update: 的 selected。
                        双向绑定事件，当回调参数与refKind.value不同时，将获取的回调参数赋予refKind.value，并将refKind.value赋予 update: 的 selected，该行为将使Tabs重新渲染。 */}
                        <Tabs v-model:selected={refKind.value} class={s.tabs} >
                            <Tab name="支出" class={s.tags_wrapper}>
                            <div class={s.tag}>
                                <div class={s.sign}>
                                    <Icon name="add" class={s.createTag} />
                                </div>
                                <div class={s.name}>
                                    新增
                                </div>
                            </div>
                                {refExpensesTags.value.map(tag =>
                                    <div class={[s.tag, s.selected]}>
                                        <div class={s.sign}>
                                            {tag.sign}
                                        </div>
                                        <div class={s.name}>
                                            {tag.name}
                                        </div>
                                    </div>
                                )}
                            </Tab>
                            <Tab name="收入" class={s.tags_wrapper}>
                                <div class={s.tag}>
                                    <div class={s.sign}>
                                        <Icon name="add" class={s.createTag} />
                                    </div>
                                    <div class={s.name}>
                                        新增
                                    </div>
                                </div>
                                {refIncomeTags.value.map(tag =>
                                    <div class={[s.tag, s.selected]}>
                                        <div class={s.sign}>
                                            {tag.sign}
                                        </div>
                                        <div class={s.name}>
                                            {tag.name}
                                        </div>
                                    </div>
                                )}
                            </Tab>
                        </Tabs>
                        {/* 用div为InputPad作定位 */}
                        <div class={s.inputPad_wrapper}>
                            <InputPad/>
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})