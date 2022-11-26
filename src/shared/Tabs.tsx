import { defineComponent, PropType } from 'vue';
import s from './Tabs.module.scss';
let a = 0
export const Tabs = defineComponent({
  props: {
    classPrefix: {
      type: String
    },
    selected: {
      type: String as PropType<string>,
      required: false,
    }
  },
  emits:['update:selected'],
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
      const cp = props.classPrefix
      //利用 classPrefix 为 Tabs 自定义样式，只能写在 App.scss 做全局样式，慎用
      return <div class={[s.tabs, cp + '_tabs']}>
        <ol class={[s.tabs_nav, cp + '_tabs_nav']}>
          {
            //map遍历tabs，渲染显示所有Tab的name
            tabs.map(item =>
              <li //获取item的name，如果与selected相同，使class为s.selected，否则为空
                class={[
                  item.props?.name === props.selected ? [s.selected, cp + '_selected'] : '',
                  cp + '_tabs_nav_item'
                ]}
                //声明onClick事件，事件触发时将自身的name作为回调参数
                onClick={() => context.emit('update:selected', item.props?.name)}
              >
                {item.props?.name}
              </li>
            )
          }
        </ol>
        <div>
          {tabs.map(item => 
            <div v-show={item.props?.name === props.selected}>{item}</div>  
          )}
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