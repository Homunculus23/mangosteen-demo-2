import s from './welcome.module.scss';
import { defineComponent, FunctionalComponent, ref, watchEffect } from 'vue';
import { useSwipe } from '../../hooks/useSwipe';
import { useRouter } from 'vue-router';
export const First = defineComponent({
  setup() {
    const div = ref<HTMLDivElement>() //在下方的div里绑定ref={div}
    const router = useRouter()  //注意useRoute是路由内容，useRouter是路由器
    const { swiping, direction } = useSwipe(div, {
      beforeStart: e => e.preventDefault()
    })  //监听div，获得swiping和direction
    watchEffect(()=>{ //添加第二个页面的路由
      if(swiping.value && direction.value === 'left'){
        router.push('/welcome/2')
      }
    })
    return () => (
      <div class={s.card} ref={div}>
      <svg>
        <use xlinkHref='#pig'></use>
      </svg>
      <h2>会挣钱<br />还会省钱</h2>
      </div>
    )
  }
})