import { defineComponent, defineProps, PropType } from 'vue';
import s from './Icon.module.scss';

export type IconName = 'add' | 'chart' | 'clock' | 'cloud' | 'mangosteen' | 'pig' | 'menu'
//列出所有用到的Icon，可以保证准确率，不会出错；导出是为了给FloatButton的props使用

export const Icon = defineComponent({
    //props:{}, 的写法非常常用，需要记住
    props: {  //Vue3会把代码转化为JS运行，因此不能以 <Props> 的TS形式来声明
        name: {
            type: String as PropType<IconName>,
            required: true, //我们期望props.name不支持undefined，必须写这一句
        }
    },
    setup: (props, context) => {  //将props传进来，use才能使用props.name
        return () => (
            <svg class={s.icon}>
                <use xlinkHref={'#' + props.name}></use>
            </svg>
        )
    }
})