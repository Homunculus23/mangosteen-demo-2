import { defineComponent, reactive } from "vue";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Form, FormItem } from "../../shared/Form";
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
            <Form onSubmit={onSubmit}>
                <FormItem label="标签名" type="text" v-model={formData.name} error={errors['name'] ? errors['name']?.[0] : '\u3000'}/>
                <FormItem label={'符号' + formData.sign} type="emojiSelect" v-model={formData.sign} error={errors['sign'] ? errors['sign']?.[0] : '\u3000'}/>
                <FormItem>
                    {/* FormItem可以为 p 和 Button 自动添加margin。 自定义内容不需要写type。*/}
                    <p class={s.tips}>记账时长按标签即可进行编辑</p>
                </FormItem>
                <FormItem>
                    <Button class={[s.button]}>确定</Button>
                </FormItem>
            </Form>
        );
    }
})