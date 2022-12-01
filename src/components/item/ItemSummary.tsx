import { defineComponent, onMounted, PropType, ref } from "vue";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
import { http } from "../../shared/Http";
import s from "./ItemSummary.module.scss";
export const ItemSummary = defineComponent({
  props: {
    startDate: {
      //这里类型限制日期或字符串都可以，但字符串更泛用，且转换简单
      type: String as PropType<string>,
    },
    endDate: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    // 部分代码与 useTags 高度相似
    const items = ref<Item[]>([]);
    const hasMore = ref(false);
    const page = ref(0);
    const fetchItems = async () => {
      if (!props.startDate || !props.endDate) {
        return;
      }
      const response = await http.get<Resources<Item>>("/items", {
        // 起始时间
        happen_after: props.startDate,
        // 结束时间
        happen_before: props.endDate,
        page: page.value + 1,
        _mock: "itemIndex",
      });
      const { resources, pager } = response.data;
      // 将 resources 放到 item 里
      items.value?.push(...resources);
      // 根据 pager 计算是否有下一页，有则展示加载按钮，否则展示提醒
      hasMore.value =
        (pager.page - 1) * pager.per_page + resources.length < pager.count;
      page.value += 1;
    };
    // 加载后先获取第一页数据
    onMounted(fetchItems);
    return () => (
      <div class={s.wrapper}>
        {items.value ? (
          <>
            <ul class={s.total}>
              <li>
                <span>收入</span>
                <span>128</span>
              </li>
              <li>
                <span>支出</span>
                <span>99</span>
              </li>
              <li>
                <span>净收入</span>
                <span>39</span>
              </li>
            </ul>
            <ol class={s.list}>
              {items.value.map((item) => (
                <li>
                  <div class={s.sign}>
                    <span>{item.tags_id[0]}</span>
                  </div>
                  <div class={s.text}>
                    <div class={s.tagAndAmount}>
                      <span class={s.tag}>{item.tags_id[0]}</span>
                      <span class={s.amount}>
                        ￥<>{item.amount}</>
                      </span>
                    </div>
                    <div class={s.time}>{item.happen_at}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div class={s.more}>
              {hasMore.value ? (
                <Button onClick={fetchItems}>加载更多</Button>
              ) : (
                <span>没有更多</span>
              )}
            </div>
          </>
        ) : (
          <div>记录为空</div>
        )}
        <FloatButton iconName="add" />
      </div>
    );
  },
});
