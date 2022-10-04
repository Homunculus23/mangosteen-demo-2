import { defineComponent, PropType } from "vue";


export const Overlay = defineComponent({
    props:{
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            <div>
                Overlay
            </div>
        );
    }
})