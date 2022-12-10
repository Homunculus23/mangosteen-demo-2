import { Overlay } from "vant";
import { defineComponent, PropType, reactive, ref } from "vue";
import { Form, FormItem } from "../shared/Form";
import { OverlayIcon } from "../shared/Overlay";
import { Tab, Tabs } from "../shared/Tabs";
import { Time } from "../shared/time";
import s from "./TimeTabsLayout.module.scss";
import { MainLayout } from "./MainLayout";
const demo = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
    },
    endDate: {
      type: String as PropType<string>,
    },
  },
});
export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true,
    },
    rerenderOnSwitchTab: {
      type: Boolean,
      default: true,
    },
    hideThisYear: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props, context) => {
    const refSelected = ref("本月");
    const time = new Time();
    // 自定义时间中间变量
    const tempTime = reactive({
      start: new Time().format(),
      end: new Time().format(),
    });
    const customTime = reactive<{
      start?: string;
      end?: string;
    }>({});
    const timeList = [
      //本月
      { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
      //下月
      {
        start: time.add(-1, "month").firstDayOfMonth(),
        end: time.add(-1, "month").lastDayOfMonth(),
      },
      //今年
      { start: time.firstDayOfYear(), end: time.lastDayOfYear() },
    ];
    const refOverlayVisible = ref(false);
    const onSubmitCustomTime = (e: Event) => {
      //阻止默认动作必须写在最前面，否则可能出bug
      e.preventDefault();
      refOverlayVisible.value = false;
      // 触发 onSubmit 时，将 tempTime 写入 customTime
      Object.assign(customTime, tempTime);
    };
    const onSelect = (value: string) => {
      if (value === "自定义时间") {
        refOverlayVisible.value = true;
      }
    };
    return () => (
      <MainLayout>
        {{
          title: () => "猫咪记账",
          icon: () => <OverlayIcon />,
          default: () => (
            <>
              {props.hideThisYear ? (
                <Tabs
                  classPrefix="customTabs"
                  v-model:selected={refSelected.value}
                  onUpdate:selected={onSelect}
                  rerenderOnSelect={props.rerenderOnSwitchTab}
                >
                  <Tab name="本月">
                    <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                  </Tab>
                  <Tab name="上月">
                    <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                  </Tab>
                  <Tab name="自定义时间">
                    <props.component startDate={customTime.start} endDate={customTime.end} />
                  </Tab>
                </Tabs>
              ) : (
                <Tabs
                  classPrefix="customTabs"
                  v-model:selected={refSelected.value}
                  onUpdate:selected={onSelect}
                  rerenderOnSelect={props.rerenderOnSwitchTab}
                >
                  <Tab name="本月">
                    <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                  </Tab>
                  <Tab name="上月">
                    <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                  </Tab>
                  <Tab name="今年">
                    <props.component startDate={timeList[2].start.format()} endDate={timeList[2].end.format()} />
                  </Tab>
                  <Tab name="自定义时间">
                    <props.component startDate={customTime.start} endDate={customTime.end} />
                  </Tab>
                </Tabs>
              )}
              <Overlay show={refOverlayVisible.value} class={s.overlay}>
                <div class={s.overlay_inner}>
                  <header>请选择时间</header>
                  <main>
                    <Form onSubmit={onSubmitCustomTime}>
                      <FormItem label="开始时间" v-model={tempTime.start} type="date" />
                      <FormItem label="结束时间" v-model={tempTime.end} type="date" />
                      <FormItem>
                        <div class={s.actions}>
                          <button type="button" onClick={() => (refOverlayVisible.value = false)}>
                            取消
                          </button>
                          <button type="submit">确认</button>
                        </div>
                      </FormItem>
                    </Form>
                  </main>
                </div>
              </Overlay>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
