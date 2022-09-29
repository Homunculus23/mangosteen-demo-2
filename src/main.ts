import { routes } from './config/routes';
import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { history } from './shared/history';
//由于VSCode等编辑器不支持直接import svgstore.js 文件，因此需要在该js中用 @svgstore return 一次函数名
import '@svgstore';

const router = createRouter({ history, routes })

const app = createApp(App)
app.use(router)
app.mount('#app')
