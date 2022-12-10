import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
export const SkipFeatures = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      // 用户点击跳过，说明已经看过欢迎界面
      localStorage.setItem("skipFeatures", "yes");
    };
    return () => (
      <span onClick={onClick}>
        <RouterLink to="/items">跳过</RouterLink>
      </span>
    );
  },
});
