import { AxiosResponse } from "axios";
import { http } from "./Http";

export let mePromise: Promise<AxiosResponse<Resource<User>>> | undefined;
export const meRefresh = () => {
  // 抽离 mePromise 而不是直接写在 beforeEach() 中，跳转页面就不会重复请求
  // mePromise = http.get<{ resource: { id: number } }>("/me");
  mePromise = http.get<Resource<User>>("/me");
  return mePromise;
};
export const meFetch = meRefresh;
