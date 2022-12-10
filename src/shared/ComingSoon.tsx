import { defineComponent, PropType } from "vue";
import { MainLayout } from "../layouts/MainLayout";
import { Center } from "./Center";
import s from "./ComingSoon.module.scss";
import { Icon } from "./Icon";
import { OverlayIcon } from "./Overlay";
export const ComingSoon = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    return () => (
      <MainLayout>
        {{
          title: () => "蓝猫记账",
          icon: () => <OverlayIcon />,
          default: () => (
            <div>
              <Center class={s.pig_wrapper}>
                <Icon name="cat" class={s.pig} />
              </Center>
              <p class={s.text}>敬请期待</p>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
