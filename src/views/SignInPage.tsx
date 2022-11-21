import axios from "axios";
import { defineComponent, PropType, reactive, ref } from "vue";
import { useBool } from "../hooks/useBool";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { http } from "../shared/Http";
import { Icon } from "../shared/Icon";
import { validate } from "../shared/validate";
import s from './SignInPage.module.scss';
export const SignInPage = defineComponent({
    setup: (props, context) => {
        const formData = reactive({
            email: 'fpatr@qq.com',
            code: ''
        })
        const errors = reactive({
            email: [],
            code:[]
        })
        const refValidationCode = ref<any>()
        // disable默认为false
        const {ref: refDisabled, toggle, on, off} = useBool(false)
        //验证表单
        const onSubmit = (e: Event) => {
            e.preventDefault()
            //清空errors信息
            Object.assign(errors, {
                email: [], code: []
            })
            Object.assign(errors, validate(formData, [
                { key: 'email', type: 'required', message: "必填"},//验证是否为空
                { key: 'email', type: 'pattern', regex: /.+@.+/, message: "必须是邮箱地址"},//验证是否为邮箱
                { key: 'code', type: 'required', message: "必填"},
            ]))
        }
        const onError = (error:any) => {
            if (error.response.status === 422) {
                Object.assign(errors, error.response.data.errors)
            }
            //如果这里不抛出错误，下面的 .catch 会以为错误已经被解决，开始下一步的倒计时
            throw error
        }
        const onClickSendValidationCode = async () =>{
            // 请求开始时，将 disable 改为 true
            on()
            const response = await http.post('/validation_codes', { email: formData.email })
                // 401：检查路径是否错误；429：请求过于频繁；暂时将email语法错误归并到请求频繁
                .catch(onError)
                // 请求结束时，无论成败，将 disable 改为 false
                .finally(off)
            //成功
            refValidationCode.value.startCount()
        }
        return () => (
            <MainLayout>{{
                title: () => '登录',
                icon: () =><Icon name="left"/>,
                default: () => (
                    <div class={s.wrapper}>
                        <div class={s.logo}>
                            <Icon class={s.icon} name="mangosteen"/>
                            <h1 class={s.appName}>山竹记账</h1>
                        </div>
                        <Form onSubmit={onSubmit}> 
                            <FormItem label="邮箱地址" type="text" v-model={formData.email} error={errors.email?.[0]} placeholder="请输入邮箱，然后点击发送验证码"/>
                            <FormItem countFrom={1} ref={refValidationCode} label="验证码" type="validationCode" placeholder="请输入六位数字" disabled={refDisabled.value} onClick={onClickSendValidationCode} v-model={formData.code} error={errors.code?.[0]}/>
                            <FormItem style={{paddingTop: '96px'}}>
                                <Button>登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                )
            }}</MainLayout>
        );
    }
})