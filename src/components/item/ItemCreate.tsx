import { defineComponent, onMounted, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
import { useTags } from "../../shared/useTags";
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
        const { tags: expensesTags, hasMore, fetchTags } = useTags((page) =>{
            return http.get<Resources<Tag>>('/tags', {
                kind: 'expenses',
                page: page + 1,
                _mock: 'tagIndex',
            })
        })
        const { tags: incomeTags, 
            hasMore: hasMore2, 
            fetchTags: fetchTags2 
        } = useTags((page) =>{
            return http.get<Resources<Tag>>('/tags', {
                kind: 'income',
                page: page + 1,
                _mock: 'tagIndex',
            })
        })

        

        // 本页面的接口，即使后端做出来了也不会马上有数据，我们终究要 Mock 一波假数据
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
                            <Tab name="支出">
                                <div class={s.tags_wrapper}>
                                    <div class={s.tag}>
                                        <div class={s.sign}>
                                            <Icon name="add" class={s.createTag} />
                                        </div>
                                        <div class={s.name}>
                                            新增
                                        </div>
                                    </div>
                                    {expensesTags.value.map(tag =>
                                        <div class={[s.tag, s.selected]}>
                                            <div class={s.sign}>
                                                {tag.sign}
                                            </div>
                                            <div class={s.name}>
                                                {tag.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div class={s.more}>
                                    { hasMore.value?
                                        <Button class={s.loadMore} onClick={fetchTags}>加载更多</Button> :
                                        <span class={s.noMore}>没有更多</span>
                                    }
                                </div>
                            </Tab>
                            <Tab name="收入">
                                <div class={s.tags_wrapper}>
                                    <div class={s.tag}>
                                        <div class={s.sign}>
                                            <Icon name="add" class={s.createTag} />
                                        </div>
                                        <div class={s.name}>
                                            新增
                                        </div>
                                    </div>
                                    {incomeTags.value.map(tag =>
                                        <div class={[s.tag, s.selected]}>
                                            <div class={s.sign}>
                                                {tag.sign}
                                            </div>
                                            <div class={s.name}>
                                                {tag.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div class={s.more}>
                                    { hasMore2.value?
                                        <Button class={s.loadMore} onClick={fetchTags2}>加载更多</Button> :
                                        <span class={s.noMore}>没有更多</span>
                                    }
                                </div>
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