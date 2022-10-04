import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from './Icon';
import s from './Overlay.module.scss';
export const Overlay = defineComponent({
  props: {
    //使StartPage的refOverlayVisible为false，关闭浮动菜单
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.()
      //也可以用context传输emit的close（详见eDiary笔记）
    }
    const onClickSignIn = () => { }
    return () => <>
      {/* mask：右侧半透明区域 */}
      <div class={s.mask} onClick={close}></div>
      <div class={s.overlay}>
        <section class={s.currentUser} onClick={onClickSignIn}>
          <h2>未登录用户</h2>
          <p>点击这里登录</p>
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
                <Icon name="export" class={s.icon}/>
                <span>导出数据</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/notify" class={s.action}>
                <Icon name="notify" class={s.icon}/>
                {/* 记账提醒最好用email或其他免费方式代替，短信4分钱一条，太多了还额外扣钱的T-T */}
                <span>记账提醒</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  }
})