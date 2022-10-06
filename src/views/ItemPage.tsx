import { defineComponent, PropType } from "vue";
import { ItemCreate } from "../components/item/ItemCreate";
import s from './ItemPage.module.scss';
export const ItemPage = defineComponent({
    props:{
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            <div class={s.wrapper}>
                <ItemCreate>嘿</ItemCreate>
            </div>
        );
    }
})