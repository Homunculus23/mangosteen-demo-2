import { routes } from './config/routes';
import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { history } from './shared/history';
//由于VSCode等编辑器不支持直接import svgstore.js 文件，因此需要在该js中用 @svgstore return 一次函数名
import '@svgstore';
import { http } from './shared/Http';
import { meFetch, mePromise } from './shared/me';

const router = createRouter({ history, routes })

meFetch()

// 路由守卫
router.beforeEach(async (to, from)=>{
    // 如果路由为'/' ，或者以 '/welcome' 或 'sign_in' 开头(startWith的作用)
    if(to.path === '/' || to.path === '/start' || to.path.startsWith('/welcome') || to.path.startsWith('/sign_in')){
        return true
    }else{
    // 请求当前用户信息，如果成功就进入 ItemList/ItemCreate，否则进入登录页面
      const path = await mePromise!.then(
        // 成功
        () => true,
        // 失败
        () =>{
        return '/sign_in?return_to=' + to.path
      })
      return path
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
