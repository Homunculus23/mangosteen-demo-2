import { defineComponent, ref } from "vue";
import { RouterLink } from "vue-router";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../shared/Button";
import { Center } from "../shared/Center";
import { FloatButton } from "../shared/FloatButton";
import { Icon } from "../shared/Icon";
import { Overlay, OverlayIcon } from "../shared/Overlay";
import s from "./StartPage.module.scss";
export const StartPage = defineComponent({
  //start这个单词太泛用，还是取名为StartPage。这类问题一开始就要考虑好
  setup: (props, context) => {
    //visible:可见
    return () => (
      //由于Navbar的公用样式无法让icon图标合理填充，只能给StartPage的icon直接添加样式
      <MainLayout>
        {{
          title: () => "山竹记账",
          icon: () => <OverlayIcon />,
          //注意default里的Center等标签需要用 <></> 包裹
          default: () => (
            <>
              <Center class={s.pig_wrapper}>
                <Icon name="pig" class={s.pig} />
              </Center>
              <div class={s.button_wrapper}>
                <RouterLink to="/items/create">
                  <Button class={s.button}>开始记账</Button>
                </RouterLink>
              </div>
              <RouterLink to="/items/create">
                <FloatButton iconName="add" />
              </RouterLink>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
