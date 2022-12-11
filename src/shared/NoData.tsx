import { defineComponent, PropType } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "./Button";
import { Center } from "./Center";
import { Icon } from "./Icon";
import s from "./NoData.module.scss";
export const NoData = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Center class={s.cat_wrapper}>
          <Icon name="cat" class={s.cat} />
          <p>目前没有数据</p>
        </Center>
        <div class={s.button_wrapper}>
          <RouterLink to="/items/create">
            <Button class={s.button}>开始记账</Button>
          </RouterLink>
        </div>
      </div>
    );
  },
});
