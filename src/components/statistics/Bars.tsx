import { computed, defineComponent, PropType, reactive } from "vue";
import { MoneyToString } from "../../shared/MoneyToString";
import s from "./Bars.module.scss";
export const Bars = defineComponent({
  props: {
    data: {
      type: Array as PropType<{ tag: Tag; amount: number; percent: number }[]>,
    },
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        {props.data && props.data.length > 0 ? (
          props.data.map(({ tag, amount, percent }) => {
            return (
              //topItem：最花钱的项目。左边为 sign，右边为 bar。
              <div class={s.topItem}>
                <div class={s.sign}>{tag.sign}</div>
                {/* bar分为上下结构，左上为项目名+百分比，右上为金额，下方为横条 */}
                <div class={s.bar_wrapper}>
                  <div class={s.bar_text}>
                    <span>
                      {tag.name} - {percent}%
                    </span>
                    <span>
                      ￥<MoneyToString value={amount} />
                    </span>
                  </div>
                  <div class={s.bar}>
                    <div class={s.bar_inner} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>没有数据</div>
        )}
      </div>
    );
  },
});
