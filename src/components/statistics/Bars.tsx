import { computed, defineComponent, PropType, reactive } from "vue";
import s from './Bars.module.scss';
export const Bars = defineComponent({
    setup: (props, context) => {
        const data3 = reactive([
            { tag: { id: 1, name: '房租', sign: 'x' }, amount: 3000 },
            { tag: { id: 2, name: '吃饭', sign: 'x' }, amount: 1000 },
            { tag: { id: 3, name: '娱乐', sign: 'x' }, amount: 900 },
        ])
        //betterData3求取各个 amount 占总收/支的百分比，并添加到percent属性中
        const betterData3 = computed(() => {
            const total = data3.reduce((sum, item) => sum + item.amount, 0)
            return data3.map(item => ({
                ...item,
                //显示的百分比不需要小数，Math.round四舍五入
                percent: Math.round(item.amount / total * 100) + '%'
            }))
        })
        return () => (
            <div class={s.wrapper}>
                    {betterData3.value.map(({ tag, amount, percent }) => {
                        return (
                        //topItem：最花钱的项目。左边为 sign，右边为 bar。
                        <div class={s.topItem}>
                            <div class={s.sign}>
                                {tag.sign}
                            </div>
                            {/* bar分为上下结构，左上为项目名+百分比，右上为金额，下方为横条 */}
                            <div class={s.bar_wrapper}>
                                <div class={s.bar_text}>
                                    <span> {tag.name} - {percent} </span>
                                    <span> ￥{amount} </span>
                                </div>
                                <div class={s.bar}>
                                    <div class={s.bar_inner}></div>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
        );
    }
})