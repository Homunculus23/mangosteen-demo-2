import { number } from "echarts";
import { DatetimePicker, Popup } from "vant";
import { computed, defineComponent, PropType, ref, VNode } from "vue";
import { Button } from "./Button";
import { EmojiSelect } from "./EmojiSelect";
import s from "./Form.module.scss";
import { getFriendlyError } from "./getFriendlyError";
import { Time } from "./time";
export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    );
  },
});

export const FormItem = defineComponent({
  props: {
    label: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
    type: {
      type: String as PropType<"text" | "emojiSelect" | "date" | "validationCode" | "select">,
    },
    error: {
      type: String,
    },
    placeholder: String,
    options: Array as PropType<Array<{ value: string; text: string }>>,
    onClick: Function as PropType<() => void>,
    countFrom: {
      type: Number,
      default: 60,
    },
    disabled: Boolean,
  },
  emits: ["update:modelValue"],
  setup: (props, context) => {
    const refDateVisible = ref(false);
    //浏览器的 setTimeout 和setInterval 返回值为 number，初始为 undefined
    const timer = ref<number>();
    //初始值不能直接写60，需要在 props 中写一个配置项
    const count = ref<number>(props.countFrom);
    //判断是否在倒计时状态
    const isCounting = computed(
      () => !!timer.value //bool值与timer.value的状态一致
    );
    const startCount = () =>
      (timer.value = setInterval(() => {
        count.value--;
        if (count.value === 0) {
          //倒计时为0时清空计时器
          clearInterval(timer.value);
          //重置
          timer.value = undefined;
          count.value = props.countFrom;
        }
      }, 1000));
    context.expose({ startCount });
    //content就是最终展示出来的内容
    const content = computed(() => {
      switch (props.type) {
        case "text":
          return (
            <input
              value={props.modelValue}
              placeholder={props.placeholder}
              onInput={(e: any) => context.emit("update:modelValue", e.target.value)}
              class={[s.formItem, s.input]}
            />
          );
        case "emojiSelect":
          return (
            <EmojiSelect
              modelValue={props.modelValue?.toString()}
              onUpdateModelValue={(value) => context.emit("update:modelValue", value)}
              class={[s.formItem, s.emojiList, s.error]}
            />
          );
        case "date":
          return (
            <>
              <input
                readonly={true}
                value={props.modelValue}
                placeholder={props.placeholder}
                onClick={() => {
                  refDateVisible.value = true;
                }}
                class={[s.formItem, s.input]}
              />
              <Popup position="bottom" v-model:show={refDateVisible.value}>
                <DatetimePicker
                  value={props.modelValue}
                  type="date"
                  title="选择年月日"
                  onConfirm={(date: Date) => {
                    context.emit("update:modelValue", new Time(date).format());
                    refDateVisible.value = false;
                  }}
                  onCancel={() => (refDateVisible.value = false)}
                />
              </Popup>
            </>
          );
        case "validationCode":
          return (
            <>
              <input
                class={[s.formItem, s.input, s.validationCodeInput]}
                value={props.modelValue}
                onInput={(e: any) => context.emit("update:modelValue", e.target.value)}
                placeholder={props.placeholder}
              />
              <Button
                disabled={isCounting.value || props.disabled}
                onClick={props.onClick}
                class={[s.formItem, s.button, s.validationCodeButton]}
              >
                {isCounting.value ? `${count.value}秒后重置` : "发送验证码"}
              </Button>
            </>
          );
        case "select":
          //监听 onChange 事件
          return (
            <select
              class={[s.formItem, s.select]}
              value={props.modelValue}
              onChange={(e: any) => {
                context.emit("update:modelValue", e.target.value);
              }}
            >
              {/* 遍历props.options，显示传过来的value为props.modelValue的option.text */}
              {props.options?.map((option) => (
                <option value={option.value}>{option.text}</option>
              ))}
              <option></option>
            </select>
          );
        case undefined:
          //没有写属性，直接展示插槽
          return context.slots.default?.();
      }
    });
    return () => {
      return (
        <div class={s.formRow}>
          <label class={s.formLabel}>
            {props.label && <span class={s.formItem_name}>{props.label}</span>}
            <div class={s.formItem_value}>{content.value}</div>
            <div class={s.formItem_errorHint}>
              <span>{props.error ? getFriendlyError(props.error) : "\u3000"}</span>
            </div>
          </label>
        </div>
      );
    };
  },
});
