import { defineComponent } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { TagForm } from "./TagForm";
import s from "./Tag.module.scss";
import { BackIcon } from "../../shared/BackIcon";
import { useRoute, useRouter } from "vue-router";
import { http } from "../../shared/Http";
import { Dialog } from "vant";
export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();
    const numberId = parseInt(route.params.id.toString());
    const onError = () => {
      Dialog.alert({ title: "提示", message: "删除失败" });
    };
    // 注：后端还没有做单独删除标签的功能，
    const onDelete = async (options?: { withItems?: boolean }) => {
      await Dialog.confirm({
        title: "确认",
        message: "你真的要删除吗？",
      });
      // 发送删除请求
      await http
        .delete(`/tags/${numberId}`, {
          withItems: options?.withItems ? "true" : "false",
        })
        .catch(onError);
      router.back();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "编辑标签",
          icon: () => <BackIcon />,
          default: () => (
            <>
              <TagForm id={numberId} />
              <div class={s.actions}>
                <Button
                  level="danger"
                  class={s.removeTags}
                  onClick={() => onDelete()}
                >
                  删除标签
                </Button>
                <Button
                  level="danger"
                  class={s.removeTagsAndItems}
                  // 绝对不要在参数里直接使用布尔值！如果需要时，设计成对象
                  onClick={() => onDelete({ withItems: true })}
                >
                  删除标签和记账
                </Button>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
