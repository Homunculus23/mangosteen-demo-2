import axios from "axios";
import { defineComponent, PropType, reactive, ref } from "vue";
import { routerKey, useRoute, useRouter } from "vue-router";
import { useBool } from "../hooks/useBool";
import { MainLayout } from "../layouts/MainLayout";
import { BackIcon } from "../shared/BackIcon";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { history } from "../shared/history";
import { http } from "../shared/Http";
import { Icon } from "../shared/Icon";
import { meRefresh } from "../shared/me";
import { hasError, validate } from "../shared/validate";
import s from "./SignInPage.module.scss";
export const SignInPage = defineComponent({
  setup: (props, context) => {
    const formData = reactive({
      email: "",
      code: "",
    });
    const errors = reactive({
      email: [],
      code: [],
    });
    const refValidationCode = ref<any>();
    // disable默认为false
    const { ref: refDisabled, toggle, on, off } = useBool(false);
    // router 是路由器，包含一个 .push() 方法用于改变路由；route 是路由信息，里面只包含信息
    const router = useRouter();
    const route = useRoute();
    // 验证表单：登录
    const onSubmit = async (e: Event) => {
      e.preventDefault();
      //清空errors信息
      Object.assign(errors, {
        email: [],
        code: [],
      });
      Object.assign(
        errors,
        validate(formData, [
          { key: "email", type: "required", message: "必填" }, //验证是否为空
          {
            key: "email",
            type: "pattern",
            regex: /.+@.+/,
            message: "必须是邮箱地址",
          }, //验证是否为邮箱
          { key: "code", type: "required", message: "必填" },
        ])
      );
      // 没有 error 才发请求
      if (!hasError(errors)) {
        // 用 http 发送请求；获取 jwt
        const response = await http.post<{ jwt: string }>("/session", formData, { _autoLoading: true }).catch(onError); // 展示后端报错信息（如果有）
        // 将后端返回的 jwt 缓存
        localStorage.setItem("jwt", response.data.jwt);
        // 登陆时要注意一点，用户登录的场景可能有：初次登录；再次登录；正在操作过程中登录过期（需要返回原页面，原页面用 returnTo 存储）
        // 保存/获取原页面可以使用 localStorage，也可以利用 useRoute().query.return_to，这里使用后者
        // router.push('/sign_in?return_to=' + encodeURIComponent(route.fullPath))
        const returnTo = route.query.return_to?.toString();
        // 更新登录状态，跳转操作必须在请求结束后
        meRefresh();
        // 登录请求成功优先跳转原页面，原页面为空则跳转到首页 '/'
        router.push(returnTo || "/");
      }
    };
    // 如果前后端合作有缺憾，最好再写一个独立的 onSubmitError ，提供给 onSubmit -> response 里的 catch()
    const onError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors);
      }
      //如果这里不抛出错误，下面的 .catch 会以为错误已经被解决，开始下一步的倒计时
      throw error;
    };
    const onSubmitError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors);
      }
      throw error;
    };
    // 请求发送验证码
    const onClickSendValidationCode = async () => {
      // 请求开始时，将 disable 改为 true
      on();
      Object.assign(errors, {
        email: [],
        code: [],
      });
      Object.assign(
        errors,
        validate(formData, [
          { key: "email", type: "required", message: "必填" }, //验证是否为空
          {
            key: "email",
            type: "pattern",
            regex: /.+@.+/,
            message: "必须是邮箱地址",
          }, //验证是否为邮箱
          { key: "code", type: "required", message: "必填" },
        ])
      );
      await http
        .post(
          "/validation_codes",
          { email: formData.email },
          {
            //
            _autoLoading: true,
          }
        )
        // 401：检查路径是否错误；429：请求过于频繁；暂时将email语法错误归并到请求频繁
        .catch(onError)
        // 请求结束时，无论成败，将 disable 改为 false
        .finally(off);
      //成功
      refValidationCode.value.startCount();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "登录",
          icon: () => <BackIcon />,
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon class={s.icon} name="mangosteen" />
                <h1 class={s.appName}>山竹记账</h1>
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem
                  label="邮箱地址"
                  type="text"
                  v-model={formData.email}
                  error={errors.email?.[0]}
                  placeholder="请输入邮箱，然后点击发送验证码"
                />
                <FormItem
                  countFrom={3}
                  ref={refValidationCode}
                  label="验证码"
                  type="validationCode"
                  placeholder="请输入六位数字"
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code}
                  error={errors.code?.[0]}
                />
                <FormItem style={{ paddingTop: "96px" }}>
                  <Button type="submit">登录</Button>
                </FormItem>
              </Form>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
