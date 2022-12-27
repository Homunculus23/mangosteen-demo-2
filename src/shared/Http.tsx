import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import { Dialog, Toast } from "vant";
import {
  mockItemCreate,
  mockItemIndex,
  mockItemIndexBalance,
  mockItemSummary,
  mockSession,
  mockTagCreate,
  mockTagEdit,
  mockTagIndex,
  mockTagShow,
} from "../mock/mock";

type GetConfig = Omit<AxiosRequestConfig, "params" | "url" | "method">;
type PostConfig = Omit<AxiosRequestConfig, "url" | "data" | "method">;
type PatchConfig = Omit<AxiosRequestConfig, "url" | "data">;
type DeleteConfig = Omit<AxiosRequestConfig, "params">;

export class Http {
  // AxiosInstance 实例
  instance: AxiosInstance;
  // 构造用于传递基础参数
  constructor(baseURL: string) {
    // 初始化
    this.instance = axios.create({
      // key、value同名，缩写即可
      baseURL,
    });
  }
  // read
  // get 一般有 url，查询字符串 query（对象），其他配置 config（可不传的属性均加?），以及 method 为 post。
  // 添加泛型<R = unknown>，在使用 get 时表示 result 类型，若不传默认 unknown
  // JSONValue 的全局引用声明在 env.d.ts
  get<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, "params">) {
    // 业务里request比get更通用，可以点进源码查看参数和功能。request() 只接受一个 config
    // 为避免 config 再传入一个 params 将前面的覆盖，可将 ...config 写在最前面，也可用 Omit 取消 params 类型的方法。这里的get两种都用了
    return this.instance.request<R>({
      ...config,
      url: url,
      params: query,
      method: "get",
    });
  }
  // create
  // 支持参数比 get 少一个 params，实在要用可通过 config 传递
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
    return this.instance.request<R>({ ...config, url, data, method: "post" });
  }
  // update
  // 同理，比 get 少一个 params。method 改为 patch
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
    return this.instance.request<R>({ ...config, url, data, method: "patch" });
  }
  // destroy
  // 比起 get，只是method 改为 delete
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
    return this.instance.request<R>({
      ...config,
      url: url,
      params: query,
      method: "delete",
    });
  }
}

// 导出的默认实例
export const http = new Http(DEBUG ? "api/v1" : "http://121.196.236.94:3000/api/v1");

// interceptors：拦截器，相关文档搜文章 Axios作弊表 。
// 将获取的 jwt 放进请求头，这里的 jwt 就是 token
http.instance.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    // 这里报错，可以告知类型： (config.headers as AxiosRequestHeaders) ；也可以在 config.headers 后面加 ! 断言，加 ! 是告诉ts语法检测，它一定不会为空。
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${jwt}`;
  }
  // 加载中配置
  if (config._autoLoading === true) {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
  }
  return config;
});

// 加载中clear()
http.instance.interceptors.response.use(
  (response) => {
    if (response.config._autoLoading === true) {
      Toast.clear();
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.config._autoLoading === true) {
      Toast.clear();
    }
    throw error;
  }
);
if (DEBUG) {
  import("../mock/mock").then(
    ({
      mockItemCreate,
      mockItemIndex,
      mockItemIndexBalance,
      mockItemSummary,
      mockSession,
      mockTagEdit,
      mockTagIndex,
      mockTagShow,
    }) => {
      const mock = (response: AxiosResponse) => {
        switch (response.config?._mock) {
          case "tagIndex":
            [response.status, response.data] = mockTagIndex(response.config);
            return true;
          case "session":
            [response.status, response.data] = mockSession(response.config);
            return true;
          case "itemCreate":
            [response.status, response.data] = mockItemCreate(response.config);
            return true;
          case "tagShow":
            [response.status, response.data] = mockTagShow(response.config);
            return true;
          case "tagEdit":
            [response.status, response.data] = mockTagEdit(response.config);
            return true;
          case "itemIndex":
            [response.status, response.data] = mockItemIndex(response.config);
            return true;
          case "itemIndexBalance":
            [response.status, response.data] = mockItemIndexBalance(response.config);
            return true;
          case "itemSummary":
            [response.status, response.data] = mockItemSummary(response.config);
            return true;
        }
        return false;
      };
      http.instance.interceptors.response.use(
        (response) => {
          mock(response);
          if (response.status >= 400) {
            throw { response };
          } else {
            return response;
          }
        },
        (error) => {
          mock(error.response);
          if (error.response.status >= 400) {
            throw error;
          } else {
            return error.response;
          }
        }
      );
    }
  );
}
http.instance.interceptors.response.use(
  (response) => {
    // 成功返回 response
    return response;
  },
  (error) => {
    //共有错误，业务错误在 SingInPage.tsx
    // error 存在 response 属性就是一个请求错误
    if (error.response) {
      // 断言
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        Dialog.alert({
          title: "提示",
          message: "操作过于频繁",
        });
      }
    }
    // 抛出错误
    throw error;
    // 也可以用这种办法抛出错误： return Promise.reject(error)
  }
);
