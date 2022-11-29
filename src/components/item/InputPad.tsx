import { defineComponent, PropType, ref } from 'vue';
import { Icon } from '../../shared/Icon';
import { Time } from '../../shared/time';
import s from './InputPad.module.scss';
import { DatetimePicker, NumberKeyboard, Popup } from 'vant';
export const InputPad = defineComponent({
  props: {
    happenAt: String,
    amount: Number, 
    // onSubmit: {
    //   type: Function as PropType<() =>void>
    // }
  },
  setup: (props, context) => {
    props.onSubmit
    //对用户输入的数字进行检查，符合要求者追加到refAmount中。注：如果运行速度到了瓶颈，可以统计用户使用时各个判断的触发频率，将触发频率高的放在前面以进行优化（热门APP才需要）。
    const appendText = (n: number | string) => {
      const nString = n.toString()  //当前输入
      const dotIndex = refAmount.value.indexOf('.') //小数点下标
      if (refAmount.value.length >= 13) { //位数上限13
        return
      }
      if (dotIndex >= 0 && refAmount.value.length - dotIndex > 2) { //小数上限2
        return
      }
      if (nString === '.') {
        if (dotIndex >= 0) { // 已经有小数点了
          return
        }
      } else if (nString === '0') {//输入值为0
        if (dotIndex === -1) { //没有小数点
          if (refAmount.value === '0') { //没小数点，且只有单独的0
            return
          }
        }
      } else {
        if (refAmount.value === '0') {  //输入第一个数字时，干掉默认占位的0
          refAmount.value = ''
        }
      }
      refAmount.value += n.toString()
    }
    const buttons = [
      { text: '1', onClick: () => { appendText(1) } },
      { text: '2', onClick: () => { appendText(2) } },
      { text: '3', onClick: () => { appendText(3) } },
      { text: '4', onClick: () => { appendText(4) } },
      { text: '5', onClick: () => { appendText(5) } },
      { text: '6', onClick: () => { appendText(6) } },
      { text: '7', onClick: () => { appendText(7) } },
      { text: '8', onClick: () => { appendText(8) } },
      { text: '9', onClick: () => { appendText(9) } },
      { text: '.', onClick: () => { appendText('.') } },
      { text: '0', onClick: () => { appendText(0) } },
      { text: '清空', onClick: () => { refAmount.value = '0' } },
      // 若 refAmount.value 为 String，需要乘100后转换为 Number 进行计算
      {
        text: '提交',
        onClick: () => {
          context.emit('update:amount',parseFloat(refAmount.value) * 100 ),
          props.onSubmit?.()
        }
      },
    ]
    const refDatePickerVisible = ref(false)
    const showDatePicker = () => refDatePickerVisible.value = true
    const hideDatePicker = () => refDatePickerVisible.value = false
    // 触发事件，传递时间
    const setDate = (date: Date) => { 
      context.emit('update:happenAt', date.toISOString()); 
      hideDatePicker() 
    }
    // refAmount 作为展示和临时存储用户输入数字的容器；若props.amount 是 Number，需要除以100后转换 String 进行展示
    const refAmount = ref(props.amount ? (props.amount / 100).toString() : '0')
    return () => <>
      <div class={s.dateAndAmount}>
        <span class={s.date}>
          <Icon name="date" class={s.icon} />
          <span>
            {/* onClick触发展示Popup浮层，并接收在DatetimePicker中选择的时间 */}
            <span onClick={showDatePicker}>{new Time(props.happenAt).format()}</span>
            {/* Popup浮层，用于包裹DatetimePicker */}
            <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
                {/* refDate.value用于将用户选择的时间传给span。当用户点击确认时，触发onConfirm，保存同时关闭Popup浮层；用户点击取消时，触发onCancel，不保存直接关闭Popup */}
              <DatetimePicker value={props.happenAt} type="date" title="选择年月日"
                onConfirm={setDate} onCancel={hideDatePicker}
              />
            </Popup>
          </span>
        </span>
        <span class={s.amount}>{refAmount.value}</span>
      </div> 
      <div class={s.buttons}>
        {/* buttons采取grid布局 */}
        {buttons.map(button =>
          <button onClick={button.onClick}>{button.text}</button>
        )}
      </div>
    </>
  }
})
