import { defineComponent, ref } from "vue";
import { Button } from "../shared/Button";
import { Center } from "../shared/Center";
import { FloatButton } from "../shared/FloatButton";
import { Icon } from "../shared/Icon";
import { Navbar } from "../shared/Navbar";
import s from './StartPage.module.scss';
export const StartPage = defineComponent({  //start这个单词太泛用，还是取名为StartPage。这类问题一开始就要考虑好
    setup: (props, context) => {
        const onClickMenu = () => {}
        return () => (
            //由于Navbar的公用样式无法让icon图标合理填充，只能给StartPage的icon直接添加样式
            <div>
                <Navbar>
                    {
                        {
                            default: () => '山竹记账', 
                            icon: () => <Icon name="menu" class={s.navIcon}/>
                        }
                    }
                </Navbar>
                <Center class={s.pig_wrapper}>
                    <Icon name="pig" class={s.pig}/>
                </Center>
                <div class={s.button_wrapper}>
                    <Button class={s.button}>开始记账</Button>
                </div>
                <FloatButton iconName="add"/>
            </div>
        );
    }
})