import { AxiosResponse } from "axios";
import { onMounted, ref } from "vue";
import { http } from "./Http";

// AxiosResponse 请求成功结果必须是 Tag 数组
type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>;
export const useTags = (fetcher: Fetcher) => {
  // 记录当前页码
  const page = ref(0);
  const hasMore = ref(false);
  // Tag 全局引用于 env.d.ts
  const tags = ref<Tag[]>([]);
  const fetchTags = async () => {
    // Resources 是全局变量
    const response = await fetcher(page.value);
    const { resources, pager } = response.data;
    tags.value.push(...resources);
    // 所有前页 + 当前请求页
    hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count;
    page.value += 1;
  };
  // 发请求
  onMounted(fetchTags);
  return { page, hasMore, tags, fetchTags };
};
