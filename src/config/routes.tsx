import { RouteRecordRaw } from "vue-router";
import { ItemCreate } from "../components/item/ItemCreate";
import { ItemList } from "../components/item/ItemList";
import { TagCreate } from "../components/tag/TagCreate";
import { TagEdit } from "../components/tag/TagEdit";
import { First } from "../components/welcome/First";
import { FirstActions } from "../components/welcome/FirstActions";
import { Forth } from "../components/welcome/Forth";
import { ForthActions } from "../components/welcome/ForthActions";
import { Second } from "../components/welcome/Second";
import { SecondActions } from "../components/welcome/SecondActions";
import { Third } from "../components/welcome/Third";
import { ThirdActions } from "../components/welcome/ThirdActions";
import { http } from "../shared/Http";
import { ItemPage } from "../views/ItemPage";
import { SignInPage } from "../views/SignInPage";
import { StartPage } from "../views/StartPage";
import { StatisticsPage } from "../views/StatisticsPage";
import { TagPage } from "../views/TagPage";
import { Welcome } from "../views/Welcome";

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  {
    path: '/welcome',
    component: Welcome,
    // 进入任意welcome前，检查localStorage中是否已经有 ('skipFeatures', 'yes')，有则直接跳转 start
    // 实际开发中，最好把每一次看广告的时间记下来，保证每次新广告用户都能看到；如果付费会员可以不看广告，则每次进入在这里发一个请求，询问是否有会员权限
    // 面试题：如何去做页面的权限控制/路由守卫？回答：使用 beforeEnter。
    beforeEnter: (to, from, next) => {
      localStorage.getItem('skipFeatures') === 'yes' ? next('/start') : next()
    },
    children: [
      { path: '', redirect: '/welcome/1'},
      { path: '1', name:"Welcome1", components: { main: First, footer: FirstActions }, },//为了实现动画效果，需要扩展一个footer，对应Welcome.tsx里name为footer的RouterView
      { path: '2', name:"Welcome2", components: { main: Second, footer: SecondActions }, },
      { path: '3', name:"Welcome3", components: { main: Third, footer: ThirdActions }, },
      { path: '4', name:"Welcome4", components: { main: Forth, footer: ForthActions }, },
    ]
  },
  {path:'/start', component:StartPage},
  {
    path:'/items', component: ItemPage,
    beforeEnter: async(to, from, next) => {
      // 请求当前用户信息，如果成功就进入 ItemList/ItemCreate，否则进入登录页面
      await http.get('/me').catch(() =>{
        next('/sign_in?return_to=' + to.path)
      })
      next()
    },
    children:[
      { path:'',component: ItemList },
      { path:'create',component: ItemCreate },
    ]
  },
  {
    path: '/tags', component: TagPage,
    children: [
      {path: 'create', component: TagCreate},
      {path: ':id/edit', component: TagEdit},//':id'代表任意标签数字
    ]
  },
  {
    path: '/sign_in', component: SignInPage,
  },
  {
    path: '/statistics', component: StatisticsPage, 
  }
]