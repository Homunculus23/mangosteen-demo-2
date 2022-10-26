import { defineComponent, PropType, reactive } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Icon } from "../../shared/Icon";
import s from './TagCreate.module.scss';
export const TagCreate = defineComponent({
    props:{
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const formData = reactive({ //reactive也可用ref取代
          name: '', //给空字符串（''）或者空（undefined）都可，优先前者
          sign: '',
        })
        return () => (
            <MainLayout>{{
                title: () =>'新建标签',
                icon: ()=> <Icon name="left" onClick={() =>{}}/>,
                default: () =>(
                    <form class={s.form}>
                        {formData.name}
                        <div class={s.formRow}>
                            <label class={s.formLabel}>
                                <span class={s.formItem_name}>标签名</span>
                                <div class={s.formItem_value}>
                                    <input v-model={formData.name} class={[s.formItem, s.input, s.error]}></input>
                                </div>
                                <div class={s.formItem_errorHint}>
                                    <span>必填</span>
                                </div>
                            </label>
                        </div>
                        <div class={s.formRow}>
                            <label class={s.formLabel}>
                                {/* formData.sign 由 onClickEmoji 传递给 v-model */}
                                <span class={s.formLabel}>符号 {formData.sign}</span>
                                <div class={s.formItem_value}>
                                    <EmojiSelect v-model={formData.sign} class={[s.formItem, s.emojiList, s.error]} />
                                </div>
                                <div class={s.formItem_errorHint}>
                                    <span>必填</span>
                                </div>
                            </label>
                        </div>
                        <p class={s.tips}>记账时长按标签即可进行编辑</p>
                        <div class={s.formRow}>    
                            <div class={s.formItem_value}>
                                <Button class={[s.formItem, s.button]}>确定</Button>    
                            </div>
                        </div>
                    </form>
                )
            }}</MainLayout>
        );
    }
})