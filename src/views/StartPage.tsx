import { defineComponent, ref } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "../shared/Button";
import { Center } from "../shared/Center";
import { FloatButton } from "../shared/FloatButton";
import { Icon } from "../shared/Icon";
import { Navbar } from "../shared/Navbar";
import { Overlay } from "../shared/Overlay";
import s from './StartPage.module.scss';
export const StartPage = defineComponent({  //start这个单词太泛用，还是取名为StartPage。这类问题一开始就要考虑好
    setup: (props, context) => {
        //visible:可见
        const refOverlayVisible = ref(false)   //!!!想获取refOverlayVisible的ref属性一定要记得写value!
        const onClickMenu = () => {
            //使refOverlayVisible取反(ref(true))
            refOverlayVisible.value = !refOverlayVisible.value
        }
        return () => (
            //由于Navbar的公用样式无法让icon图标合理填充，只能给StartPage的icon直接添加样式
            <div>
                <Navbar>
                    {
                        {
                            default: () => '山竹记账', 
                            icon: () => <Icon name="menu" class={s.navIcon} onClick={onClickMenu}/>
                        }
                    }
                </Navbar>
                <Center class={s.pig_wrapper}>
                    <Icon name="pig" class={s.pig}/>
                </Center>
                <div class={s.button_wrapper}>
                    <RouterLink to="/items/create">
                        <Button class={s.button}>开始记账</Button>
                    </RouterLink>
                </div>
                <RouterLink to="/items/create">
                    <FloatButton iconName="add"/>
                </RouterLink>
                {refOverlayVisible.value && <Overlay onClose={() => refOverlayVisible.value = false}/>}
            </div>
        );
    }
})