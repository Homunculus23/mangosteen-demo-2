import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
type JSONValue = string | number | null | boolean | JSONValue[] | { [key: string]: JSONValue };

export class Http{
    // AxiosInstance 实例
    instance: AxiosInstance
    // 构造用于传递基础参数
    constructor(baseURL: string){
        // 初始化
        this.instance = axios.create({
            // key、value同名，缩写即可
            baseURL
        })
    }
    // read
    // get 一般有 url，查询字符串 query（对象），其他配置 config（可不传的属性均加?），以及 method 为 post。
    // 添加泛型<R = unknown>，在使用 get 时表示 result 类型，若不传默认 unknown
    get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'>){
        // 业务里request比get更通用，可以点进源码查看参数和功能。request() 只接受一个 config
        return this.instance.request<R>({
            // 为避免 config 再传入一个 params 将前面的覆盖，最简单的办法是将 ...config 写在最前面。这里采用 Omit 取消 params 类型的方法
            ...config,
            url: url,
            params: query,
            method: 'post'
        })
    }
    // create
    // 支持参数比 get 少一个 params，实在要用可通过 config 传递
    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
        return this.instance.request<R>({ ...config, url, data, method: 'post' })
    }
    // update
    // 同理，比 get 少一个 params。method 改为 patch
    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data'>) {
        return this.instance.request<R>({ ...config, url, data, method: 'patch' })
    }
    // destroy
    // 比起 get，只是method 改为 delete
    delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'>) {
        return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
    }
}
// 导出的默认实例
export const http = new Http('/api/v1')
// interceptors：拦截器，相关文档搜文章 Axios作弊表 。
http.instance.interceptors.response.use(response =>{
    // 成功返回 response
    return response
}, (error) =>{
    //共有错误，业务错误在 SingInPage.tsx
    // error 存在 response 属性就是一个请求错误
    if(error.response){
        // 断言
        const axiosError = error as AxiosError
        if(axiosError.response?.status === 429){
            alert('你太频繁了')
        }
    }
    // 抛出错误
    throw error
    // 也可以用这种办法抛出错误： return Promise.reject(error)
})