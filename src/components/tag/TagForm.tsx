import { Dialog } from "vant";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "../../shared/Button";
import { Form, FormItem } from "../../shared/Form";
import { http } from "../../shared/Http";
import { onFormError } from "../../shared/onFormError";
import { hasError, Rules, validate } from "../../shared/validate";
import s from "./Tag.module.scss";
export const TagForm = defineComponent({
  props: {
    id: Number, // 可选，只有 TagEdit 需要传
  },
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();
    // 报错：没有 kind 禁止提交/编辑。通常出现在编辑到一半时，登录过期且页面刷新，重新登录后查询参数丢失导致。
    // UI设计外的信息和警告，尽量都用弹框！
    if (!route.query.kind) {
      Dialog.alert({
        title: "提示",
        message: "参数错误，请重新选择标签",
      }).then(() => {
        router.push("/items/create");
      });
    }
    // reactive也可用ref取代，使 formData 的数据能随时更新
    const formData = reactive<Partial<Tag>>({
      id: undefined,
      //给空字符串（''）或者空（undefined）都可，优先前者
      name: "",
      sign: "",
      kind: route.query.kind!.toString() as "expenses" | "income",
    });
    //声明errors类型，使用 reactive 以便于展示
    const errors = reactive<FormErrors<typeof formData>>({});
    //声明e的类型。这里不能声明为 SubmitEvent ，与onSubmit类型不符
    const onSubmit = async (e: Event) => {
      e.preventDefault();
      //rules描述校验信息时，必须写成数组，保证有序
      const rules: Rules<typeof formData> = [
        //required和pattern的判断分开写，方便message的分离。注意required判断必须先于pattern
        { key: "name", type: "required", message: "必填项" },
        //正则表达式/.{1,4}/表示pattern字符数为1~4个
        {
          key: "name",
          type: "pattern",
          regex: /^.{1,4}$/,
          message: "请填入 1 ~ 4 个字符",
        },
        { key: "sign", type: "required", message: "必选项" },
      ];
      //使用 Object.assign，使后者中与前者不同的所有属性，拷贝或覆盖前者
      // errors = {
      //     name: ['错误1', '错误2'],
      //     sign: ['错误3', '错误4'],
      // }
      // 重置 errors 信息，注意 name 和 sign 不可重置为 undefined ，否则会触发 hasError
      Object.assign(errors, {
        name: [],
        sign: [],
      });
      Object.assign(errors, validate(formData, rules));
      // 发送请求
      if (!hasError(errors)) {
        const promise = (await formData.id)
          ? http.patch(`/tags/${formData.id}`, formData, { _mock: "tagEdit", _autoLoading: true })
          : http.post("/tags", formData, { _mock: "tagCreate", _autoLoading: true });
        await promise.catch((error) => onFormError(error, (data) => Object.assign(errors, data.errors)));
        router.back();
      }
    };
    onMounted(async () => {
      if (!props.id) return;
      // 测试阶段所有的 response 务必加入 mock
      const response = await http.get<Resource<Tag>>(`/tags/${props.id}`, {}, { _mock: "tagShow", _autoLoading: true });
      Object.assign(formData, response.data.resource);
      // Object.assign(formData, response.data.resource);
    });
    return () => (
      <Form onSubmit={onSubmit}>
        <FormItem label="标签名(最多4个字符)" type="text" v-model={formData.name} error={errors["name"]?.[0]} />
        <FormItem
          label={"符号" + formData.sign}
          type="emojiSelect"
          v-model={formData.sign}
          error={errors["sign"]?.[0]}
        />
        <FormItem>
          {/* FormItem可以为 p 和 Button 自动添加margin。 自定义内容不需要写type。*/}
          <p class={s.tips}>记账时长按标签即可进行编辑</p>
        </FormItem>
        <FormItem>
          <Button type="submit" class={[s.button]}>
            确定
          </Button>
        </FormItem>
      </Form>
    );
  },
});
