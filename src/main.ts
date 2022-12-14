import { routes } from "./config/routes";
import { createApp } from "vue";
import { App } from "./App";
import { createRouter } from "vue-router";
import { history } from "./shared/history";
//由于VSCode等编辑器不支持直接import svgstore.js 文件，因此需要在该js中用 @svgstore return 一次函数名
import "@svgstore";
import { createPinia } from "pinia";
import { useMeStore } from "./stores/useMeStore";

const router = createRouter({ history, routes })
// 为了避免在 ssr 里的 跨请求状态污染， ssr 里的每一个 app 都要有自己的 pinia
// 配置 app 步骤：① create 一个 pinia，② 把 pinia 传给 app
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')

// 拿到 useMeStore
const meStore = useMeStore()
// 调用 fetchMe
meStore.fetchMe()

const openList: Record<string, "exact" | "startsWith"> = {
  "/": "exact", // key有斜杠必须加''
  "/items": "exact",
  "/welcome": "startsWith",
  "/sign_in": "startsWith",
};
// openList 可优化为：
// const openList = {
//     exact: ['/', '/start'],
//     startsWith: ['/welcome', '/sign_in']
// }

// 路由守卫
router.beforeEach((to, from) => {
  for (const key in openList) {
    const value = openList[key];
    // 若 路由 === ('exact'的 key) ，或以 ('startsWith' 的 key) 开头，返回 true
    if (value === "exact" && to.path === key) {
      return true;
    }
    if (value === "startsWith" && to.path.startsWith(key)) {
      return true;
    }
  }
  // 请求当前用户信息，如果成功就进入 ItemList/ItemCreate，否则进入登录页面
  return meStore.mePromise!.then(
    () => true, // 成功
    () => "/sign_in?return_to=" + to.path // 失败
  );
});
