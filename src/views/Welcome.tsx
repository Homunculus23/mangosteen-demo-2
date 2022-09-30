import { defineComponent, h, ref, Transition, VNode, watch, watchEffect } from 'vue';
import { RouteLocationNormalizedLoaded, RouterView } from 'vue-router';
import { useSwipe } from '../hooks/useSwipe';
import s from './Welcome.module.scss'
export const Welcome = defineComponent({
  setup: (props, context) => {
    //ref<HTMLMediaElement>()原本为ref<HTMLDivElement|null>(null)，为了防止大家的习惯不一致导致代码变成屎山，需要在README里加入代码规范并统一写法
    //三步走，1.用ref获得main的引用，并决定类型；2.在元素main中关联引用 ref={main}
    const main = ref<HTMLMediaElement>();
    //3.把main传给函数useSwipe;
    // const { direction, swiping } = useSwipe(main)  //获取useSwipe(main)中direction和swiping的返回值
    // watchEffect(()=>{
    //   console.log(direction.value, swiping.value)
    // }) //功能等同于React里的useEffect，当所在作用域任何变量发生变化时（此处为ref变化），执行watchEffect中的函数
    return () => <div class={s.wrapper}>
      <header>
        <svg>
          <use xlinkHref='#mangosteen'></use>
        </svg>
        <h1>山竹记账</h1>
      </header>
      <main class={s.main} ref={main}>
        <RouterView name="main">
          {({ Component: Content, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
            <Transition 
              enterFromClass={s.slide_fade_enter_from} 
              enterActiveClass={s.slide_fade_enter_active}
              leaveToClass={s.slide_fade_leave_to} 
              leaveActiveClass={s.slide_fade_leave_active}>
              {Content}
            </Transition>
          }
        </RouterView>
      </main>
      <footer>
        <RouterView name="footer" />
      </footer>
    </div>
  }
})