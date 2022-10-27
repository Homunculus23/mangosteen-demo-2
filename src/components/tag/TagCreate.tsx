import { defineComponent, PropType, reactive, toRaw } from "vue";
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
        //reactive也可用ref取代
        const formData = reactive({
          name: '', //给空字符串（''）或者空（undefined）都可，优先前者
          sign: '',
        })
        //声明e的类型。这里不能声明为 SubmitEvent ，与onSubmit类型不符
        const onSubmit = (e: Event) => {
            console.log(toRaw(formData))
            //rules描述校验信息时，必须写成数组，保证有序
            const rules = [
                //required和pattern的判断分开写，方便message的分离。注意required判断必须先于pattern
                {key: 'name', required: true, message:'必填'},
                //正则表达式/.{1,4}/表示pattern字符数为1~4个
                {key: 'name', pattern: /^.{1,4}$/, message:'只能填 1 到 4 个字符'},
                {key: 'sign', required: true, message:'必选'}
            ]
            // const errors = validate(formData, rules)
            // errors = {
            //     name: ['错误1', '错误2'],
            //     sign: ['错误3', '错误4'],
            // }
            e.preventDefault()
        }
        return () => (
            <MainLayout>{{
                title: () =>'新建标签',
                icon: ()=> <Icon name="left" onClick={() =>{console.log('返回')}}/>,
                default: () =>(
                    <form class={s.form} onSubmit={onSubmit}>
                        {formData.name}
                        <div class={s.formRow}>
                            <label class={s.formLabel}>
                                <span class={s.formItem_name}>标签名</span>
                                <div class={s.formItem_value}>
                                    <input v-model={formData.name} class={[s.formItem, s.input, s.error]}></input>
                                </div>
                                <div class={s.formItem_errorHint}>
                                    {/* <span>{errors['name'][0]}</span> */}
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