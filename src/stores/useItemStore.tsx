import { defineStore } from "pinia";
import { http } from "../shared/Http";
type State = {
  items: Item[];
  hasMore: boolean;
  page: number;
};
type Actions = {
  reset: () => void;
  fetchItems: (startDate?: string, endDate?: string) => void;
};
export const useItemStore = (id: string | string[]) =>
  defineStore<string, State, {}, Actions>(typeof id === "string" ? id : id.join("-"), {
    state: () => ({
      items: [],
      hasMore: false,
      page: 0,
    }),
    actions: {
      reset() {
        this.items = [];
        this.hasMore = false;
        this.page = 0;
      },
      async fetchItems(startDate, endDate) {
        if (!startDate || !endDate) {
          return;
        }
        const response = await http.get<Resources<Item>>(
          "/items",
          {
            // 起始时间
            happen_after: startDate,
            // 结束时间
            happen_before: endDate,
            page: this.page + 1,
          },
          {
            // _mock: "itemIndex",
            _autoLoading: true,
          }
        );
        const { resources, pager } = response.data;
        // 将 resources 放到 item 里
        this.items?.push(...resources);
        // 根据 pager 计算是否有下一页，有则展示加载按钮，否则展示提醒
        this.hasMore = (pager.page - 1) * pager.per_page + resources.length < pager.count;
        this.page += 1;
      },
    },
  })();
