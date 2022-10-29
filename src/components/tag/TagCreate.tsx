import { defineComponent } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import { TagForm } from "./TagForm";
export const TagCreate = defineComponent({
    setup: (props, context) => {
        return () => (
            <MainLayout>{{
                title: () =>'新建标签',
                icon: ()=> <Icon name="left" onClick={() =>{console.log('返回')}}/>,
                default: () =>(
                    <TagForm/>
                )
            }}</MainLayout>
        );
    }
})