import { defineComponent, onMounted, PropType, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
import { http } from "../../shared/Http";
import { MoneyToString } from "../../shared/MoneyToString";
import { NoData } from "../../shared/NoData";
import { Time } from "../../shared/time";
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
      const response = await http.get<Resources<Item>>(
        "/items",
        {
          // 起始时间
          happen_after: props.startDate,
          // 结束时间
          happen_before: props.endDate,
          page: page.value + 1,
        },
        {
          // _mock: "itemIndex",
          _autoLoading: true,
        }
      );
      const { resources, pager } = response.data;
      // 将 resources 放到 item 里
      items.value?.push(...resources);
      // 根据 pager 计算是否有下一页，有则展示加载按钮，否则展示提醒
      hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count;
      page.value += 1;
    };
    // 对 time 进行类型检查，返回适合展示的时间格式
    const DateTimeToString = (time: string | Date) => {
      return new Time(time).format("YYYY-MM-DD HH:mm:ss");
    };
    // 加载同时请求第一页数据
    onMounted(fetchItems);
    // 支出、收入、净收入
    const itemsBalance = reactive({
      expenses: 0,
      income: 0,
      balance: 0,
    });
    // 收、支、净收入统计请求
    const fetchItemsBalance = async () => {
      if (!props.startDate || !props.endDate) {
        return;
      }
      const response = await http.get(
        "/items/balance",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          page: page.value + 1,
        },
        {
          _mock: "itemIndexBalance",
        }
      );
      // 将 response.data 写入 itemsBalance
      Object.assign(itemsBalance, response.data);
    };
    // 自动执行的统计请求
    onMounted(fetchItemsBalance);
    // 自定义时间的items 和 统计请求
    watch(
      () => [props.startDate, props.endDate],
      () => {
        items.value = [];
        hasMore.value = false;
        page.value = 0;
        Object.assign(itemsBalance, {
          expenses: 0,
          income: 0,
          balance: 0,
        });
        fetchItems();
        fetchItemsBalance();
      }
    );
    return () => (
      <div class={s.wrapper}>
        {items.value && items.value.length > 0 ? (
          <>
            <ul class={s.total}>
              <li>
                <span>收入</span>
                <MoneyToString value={itemsBalance.income} />
              </li>
              <li>
                <span>支出</span>
                <MoneyToString value={itemsBalance.expenses} />
              </li>
              <li>
                <span>净收入</span>
                <MoneyToString value={itemsBalance.balance} />
              </li>
            </ul>
            <ol class={s.list}>
              {items.value.map((item) => (
                <li>
                  <div class={s.sign}>
                    <span>{item.tags && item.tags.length > 0 ? item.tags[0].sign : "💰"}</span>
                  </div>
                  <div class={s.text}>
                    <div class={s.tagAndAmount}>
                      <span class={s.tag}>{item.tags && item.tags.length > 0 ? item.tags[0].name : "未分类"}</span>
                      <span class={s.amount}>
                        ￥<MoneyToString value={item.amount} />
                      </span>
                    </div>
                    <div class={s.time}>{DateTimeToString(item.happen_at)}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div class={s.more}>
              {hasMore.value ? <Button onClick={fetchItems}>加载更多</Button> : <span>没有更多</span>}
            </div>
          </>
        ) : (
          <NoData />
        )}
        <RouterLink to="/items/create">
          <FloatButton iconName="add" />
        </RouterLink>
      </div>
    );
  },
});
