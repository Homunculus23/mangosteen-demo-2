import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useAfterMe } from "../../hooks/useAfterMe";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
import { http } from "../../shared/Http";
import { MoneyToString } from "../../shared/MoneyToString";
import { NoData } from "../../shared/NoData";
import { Time } from "../../shared/time";
import { useItemStore } from "../../stores/useItemStore";
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
    // 对 time 进行类型检查，返回适合展示的时间格式
    const DateTimeToString = (time: string | Date) => {
      return new Time(time).format("YYYY-MM-DD");
    };
    const itemStore = useItemStore(["items", props.startDate, props.endDate]);
    // 加载同时请求第一页数据
    useAfterMe(() => itemStore.fetchItems(props.startDate, props.endDate));
    watch(
      () => [props.startDate, props.endDate],
      () => {
        itemStore.$reset();
        // 传参
        itemStore.fetchItems(props.startDate, props.endDate);
      }
    );
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
        },
        {
          _mock: "itemIndexBalance",
        }
      );
      // 将 response.data 写入 itemsBalance
      Object.assign(itemsBalance, response.data);
    };
    // 自动执行的统计请求
    useAfterMe(fetchItemsBalance);
    // 自定义时间的items 和 统计请求
    watch(
      () => [props.startDate, props.endDate],
      () => {
        Object.assign(itemsBalance, {
          expenses: 0,
          income: 0,
          balance: 0,
        });
        fetchItemsBalance();
      }
    );
    return () =>
      !props.startDate || !props.endDate ? (
        <div>请先选择时间范围</div>
      ) : (
        <div class={s.wrapper}>
          {itemStore.items && itemStore.items.length > 0 ? (
            <>
              <ul class={s.total}>
                <li>
                  <span>收入</span>
                  <MoneyToString value={itemsBalance.income} />
                </li>
                <li>
                  <span>支出</span>
                  <div>
                    <MoneyToString value={itemsBalance.expenses} />
                  </div>
                </li>
                <li>
                  <span>净收入</span>
                  <div style={BalanceColor(itemsBalance.balance)}>
                    <MoneyToString value={itemsBalance.balance} />
                  </div>
                </li>
              </ul>
              <ol class={s.list}>
                {itemStore.items.map((item) => (
                  <li>
                    <div class={s.sign}>
                      <span>{item.tags && item.tags.length > 0 ? item.tags[0].sign : "💰"}</span>
                    </div>
                    <div class={s.text}>
                      <div class={s.tagAndAmount}>
                        <span class={s.tag}>{item.tags && item.tags.length > 0 ? item.tags[0].name : "未分类"}</span>
                        <span class={s.amount} style={MoneyColor(item.kind)}>
                          {MinusSign(item.kind)}
                          <MoneyToString value={item.amount} />
                        </span>
                      </div>
                      <div class={s.time}>{DateTimeToString(item.happen_at)}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div class={s.more}>
                {itemStore.hasMore ? (
                  <Button onClick={() => itemStore.fetchNextPage(props.startDate, props.endDate)}>加载更多</Button>
                ) : (
                  <span>没有更多</span>
                )}
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
// 根据收支决定金额和净收入的显示颜色，并为支出金额添加负号
const MoneyColor = (kind: "expenses" | "income") => {
  if (kind === "expenses") {
    return { color: "var(--total-expenses)" };
  }
  return { color: "var(--total-income)" };
};
const MinusSign = (kind: "expenses" | "income") => {
  if (kind === "expenses") {
    return "-";
  }
  return;
};
const BalanceColor = (balance: number) =>
  balance > 0 ? { color: "var(--total-income)" } : { color: "var(--total-expenses)" };
