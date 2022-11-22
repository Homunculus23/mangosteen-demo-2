import { defineComponent, PropType } from "vue";
import { RouteLocationRaw, RouterLink } from "vue-router";
import s from './SkipFeatures.module.scss';
export const SkipFeatures = defineComponent({
    setup: (props, context) => {
        const onClick = () => {
            // 用户点击跳过，说明已经看过欢迎界面
            localStorage.setItem('skipFeatures', 'yes')
        }
        return () => (
            <span onClick={onClick}>
                <RouterLink to="/start">跳过</RouterLink>
            </span>
        );
    }
})