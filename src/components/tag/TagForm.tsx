import { defineComponent, reactive } from "vue";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Rules, validate } from "../../shared/validate";
import s from './Tag.module.scss';
export const TagForm = defineComponent({
    setup: (props, context) => {
        //reactive也可用ref取代，使 formData 的数据能随时更新
        const formData = reactive({
            name: '', //给空字符串（''）或者空（undefined）都可，优先前者
            sign: '',
        })
        //声明errors类型，使用 reactive 以便于展示，使 k 的类型为 formData 的 key 的子集或者为空
        const errors = reactive<{[k in keyof typeof formData]?: string[]}>({})
        //声明e的类型。这里不能声明为 SubmitEvent ，与onSubmit类型不符
        const onSubmit = (e: Event) => {
            //rules描述校验信息时，必须写成数组，保证有序
            const rules: Rules<typeof formData> = [
                //required和pattern的判断分开写，方便message的分离。注意required判断必须先于pattern
                {key: 'name', type: 'required', message:'必填项'},
                //正则表达式/.{1,4}/表示pattern字符数为1~4个
                {key: 'name', type: 'pattern', regex: /^.{1,4}$/, message:'请填入 1 ~ 4 个字符'},
                {key: 'sign', type: 'required', message:'必选项'}
            ]
            //使用 Object.assign，使后者中与前者不同的所有属性，拷贝或覆盖前者
            // errors = {
            //     name: ['错误1', '错误2'],
            //     sign: ['错误3', '错误4'],
            // }
            Object.assign(errors, {
                name:undefined,
                sign:undefined,
            })
            Object.assign(errors, validate(formData, rules))
            e.preventDefault()
        }
        return () => (
            <form class={s.form} onSubmit={onSubmit}>
                {formData.name}
                <div class={s.formRow}>
                    <label class={s.formLabel}>
                        <span class={s.formItem_name}>标签名</span>
                        <div class={s.formItem_value}>
                            <input v-model={formData.name} class={[s.formItem, s.input, s.error]}></input>
                        </div>
                        <div class={s.formItem_errorHint}>
                            <span>{errors['name'] ? errors['name']?.[0] : '\u3000'}</span>
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
                            <span>{errors['sign']?.[0]}&#x3000;</span>
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
        );
    }
})