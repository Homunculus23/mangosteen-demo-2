import { defineComponent, PropType, reactive } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { http } from "../../shared/Http";
import { Tabs, Tab } from "../../shared/Tabs";
import { Tags } from "./Tags";
import { InputPad } from "./InputPad";
import s from "./ItemCreate.module.scss";
import { useRouter } from "vue-router";
import { Dialog } from "vant";
import { AxiosError } from "axios";
import { BackIcon } from "../../shared/BackIcon";
import { hasError, validate } from "../../shared/validate";
export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const formData = reactive<Partial<Item>>({
      kind: "expenses", // Tab的默认值是‘支出’
      tag_ids: [], // 用户点击的标签id
      amount: 0, // 金额
      happen_at: new Date().toISOString(), // 日期
    });
    const errors = reactive<FormErrors<typeof formData>>({ kind: [], tag_ids: [], amount: [], happen_at: [] });
    const router = useRouter();
    const onError = (error: AxiosError<ResourceError>) => {
      let message = "";
      if (error.response?.status === 422) {
        Object.values(error.response.data.errors).join("\n") === "必填"
          ? (message = "请选择标签")
          : (message = Object.values(error.response.data.errors).join("\n"));
        Dialog.alert({
          title: "出错",
          message: message,
        });
      }
      throw error;
    };
    const onSubmit = async () => {
      Object.assign(errors, { kind: [], tag_ids: [], amount: [], happen_at: [] });
      Object.assign(
        errors,
        validate(formData, [
          { key: "kind", type: "required", message: "支出/收入类型未指定" },
          { key: "tag_ids", type: "required", message: "请选择标签" },
          { key: "amount", type: "required", message: "请填写金额" },
          { key: "amount", type: "notEqual", value: 0, message: "金额不能为零" },
          { key: "happen_at", type: "required", message: "请选择时间" },
        ])
      );
      if (hasError(errors)) {
        Dialog.alert({
          title: "出错",
          message: Object.values(errors)
            .filter((i) => i.length > 0)
            .join("\n"),
        });
        return;
      }
      await http.post<Resource<Item>>("/items", formData, { _mock: "itemCreate", _autoLoading: true }).catch(onError);
      router.push("/items");
    };
    // 本页面的接口，即使后端做出来了也不会马上有数据，我们终究要 Mock 一波假数据
    return () => (
      //注意：<MainLayout> 和上下花括号之间不能有空格，否则花括号中的内容将会被视为数组，无法变成插槽。
      <MainLayout class={s.layout}>
        {{
          title: () => "记一笔",
          icon: () => <BackIcon />,
          default: () => (
            <>
              <div class={s.wrapper}>
                {/* 网页第一次渲染时就将refKind.value赋予 update: 的 selected。
                  双向绑定事件，当回调参数与refKind.value不同时，将获取的回调参数赋予refKind.value，并将refKind.value赋予 update: 的 selected，该行为将使Tabs重新渲染。 */}
                <Tabs v-model:selected={formData.kind} class={s.tabs}>
                  {/* Tab 内组件名均为Tags，Vue 在此时会出现切换不刷新的问题（动画也有类似问题），此处解决办法是用 v-show 展示所有 Tab 并控制显示/隐藏。该逻辑在 Tabs 组件 */}
                  <Tab value="expenses" name="支出">
                    <Tags kind="expenses" v-model:selected={formData.tag_ids![0]} />
                  </Tab>
                  <Tab value="income" name="收入">
                    <Tags kind="income" v-model:selected={formData.tag_ids![0]} />
                  </Tab>
                </Tabs>
                {/* 用div为InputPad作定位 */}
                <div class={s.inputPad_wrapper}>
                  <InputPad
                    v-model:happenAt={formData.happen_at}
                    v-model:amount={formData.amount}
                    onSubmit={onSubmit}
                  />
                </div>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
