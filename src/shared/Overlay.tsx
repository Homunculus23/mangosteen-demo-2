import { Dialog } from "vant";
import { defineComponent, onMounted, PropType, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "./Icon";
import { mePromise } from "./me";
import s from "./Overlay.module.scss";
export const Overlay = defineComponent({
  props: {
    //使StartPage的refOverlayVisible为false，关闭浮动菜单
    onClose: {
      type: Function as PropType<() => void>,
    },
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.();
      //也可以用context传输emit的close（详见eDiary笔记）
    };
    const route = useRoute();
    const me = ref<User>();
    // 请求用户信息
    onMounted(async () => {
      const response = await mePromise;
      me.value = response?.data.resource;
    });
    // 退出登录
    const onSignOut = async () => {
      await Dialog.confirm({
        title: "确认",
        message: "你真的要退出登录吗？",
      });
      localStorage.removeItem("jwt");
    };
    // const onClickSignIn = () => {};
    return () => (
      <>
        {/* mask：右侧半透明区域 */}
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <section class={s.currentUser}>
            {me.value ? (
              <div>
                <h2 class={s.email}>{me.value.email}</h2>
                <p onClick={onSignOut}>点击这里退出登录</p>
              </div>
            ) : (
              <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
                <h2>未登录用户</h2>
                <p>点击这里登录</p>
              </RouterLink>
            )}
          </section>
          <nav>
            <ul class={s.action_list}>
              <li>
                <RouterLink to="/statistics" class={s.action}>
                  <Icon name="charts" class={s.icon} />
                  <span>统计图表</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/export" class={s.action}>
                  <Icon name="export" class={s.icon} />
                  <span>导出数据</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/notify" class={s.action}>
                  <Icon name="notify" class={s.icon} />
                  {/* 记账提醒最好用email或其他免费方式代替，短信4分钱一条，太多了还额外扣钱的T-T */}
                  <span>记账提醒</span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  },
});

export const OverlayIcon = defineComponent({
  setup: (props, context) => {
    //!!!想获取refOverlayVisible的ref属性一定要记得写value!
    const refOverlayVisible = ref(false);
    const onClickMenu = () => {
      //使refOverlayVisible取反(ref(true))
      refOverlayVisible.value = !refOverlayVisible.value;
    };
    return () => (
      <>
        <Icon name="menu" class={s.icon} onClick={onClickMenu} />
        {refOverlayVisible.value && (
          <Overlay onClose={() => (refOverlayVisible.value = false)} />
        )}
      </>
    );
  },
});
