import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { http } from "../shared/Http";

type MeState = {
  me?: User;
  // 把鼠标放在 useMeStore -> actions -> refreshMe 里的 get 上 就能看到 mePromise 的类型
  mePromise?: Promise<AxiosResponse<Resource<User>>>;
};
type MeActions = {
  // 声明以下两个变量类型为函数，写成 refreshMe: Function 也能通过
  refreshMe: () => void;
  fetchMe: () => void;
};
// 定义 store，"me"是用来区分各个 store 的，后面是数据及对数据的操作；现在已经是后期，类型根据报错后面加
// 第三个数据我们不会用到，所以写空对象 {} (写 any 也能通过)
export const useMeStore = defineStore<string, MeState, {}, MeActions>("me", {
  // state 是一个函数，返回一个对象(导出需要的数据)
  // 与 actions 对比，没用到 this ，可以用箭头函数
  state: () => ({
    me: undefined,
    mePromise: undefined,
  }),
  // actions 可以写一些常规操作。用 function (普通函数)，是因为箭头函数不支持 this
  actions: {
    refreshMe() {
      // 由于 actions 在一个匿名对象里面，因此传递请求只能用 this
      this.mePromise = http.get<Resource<User>>("/me");
    },
    fetchMe() {
      this.refreshMe();
    },
  },
});
