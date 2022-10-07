import { defineComponent, PropType } from 'vue';
import s from './Tabs.module.scss';
let a = 0
export const Tabs = defineComponent({
  props: {
    selected: {
      type: String as PropType<string>,
      required: false,
    }
  },
  setup: (props, context) => {
    return () => {  //注意这里是 {} ，因为 return()=>(语句) 其实只支持一个语句且不能加入return
        //tabs为传入的数组，tabs[i]均应为Tab组件
        const tabs = context.slots.default?.()
        //数组中如果没有元素，什么都不做返回null
        if (!tabs) return () => null
        //检查tabs[i]是否均为Tab组件，如果不是则报错
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].type !== Tab) {
            throw new Error('<Tabs> only accepts <Tab> as children')
            }
        }
        return <div class={s.tabs}>
            <ol class={s.tabs_nav}>
                {
                    //map遍历tabs，渲染显示所有Tab的name
                    tabs.map(item =>
                        <li //获取item的name，如果与selected相同，使class为s.selected，否则为空
                            class={item.props?.name === props.selected ? s.selected : ''}
                            //声明onClick事件，事件触发时将自身的name作为回调参数
                            onClick={() => context.emit('update:selected', item.props?.name)}
                        >
                            {item.props?.name}
                        </li>
                    )
                }
            </ol>
            <div>
                {/* find遍历，获取name与selected相同的item */}
                {tabs.find(item => item.props?.name === props.selected)}
            </div>
        </div>
    }
  }
})
//Tab组件直接调用渲染对应内容 
export const Tab = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>{context.slots.default?.()}</div>
    )
  }
})