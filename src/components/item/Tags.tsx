import { defineComponent, onUpdated, PropType, ref } from "vue";
import { Button } from "../../shared/Button";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import s from "./Tags.module.scss";
import { useTags } from "../../shared/useTags";
import { RouterLink } from "vue-router";
export const Tags = defineComponent({
  props: {
    kind: {
      type: String as PropType<string>,
      required: true, //true必填，默认false
    },
    // 在 js 中声明类型时，首字母小写（如 number），ts 大写
    selected: Number,
  },
  emits: ["update:selected"],
  setup: (props, context) => {
    const { tags, hasMore, page, fetchTags } = useTags((page) => {
      return http.get<Resources<Tag>>("/tags", {
        kind: props.kind,
        page: page + 1,
        _mock: "tagIndex",
      });
    });
    const onSelect = (tag: Tag) => {
      context.emit("update:selected", tag.id);
    };
    // 实现长按标签且未移开手指时，编辑该标签。监听手指移动的 onTouchMove 必须放在外面的 div 上，否则无法监听移动。
    const timer = ref<number>();
    const currentTag = ref<HTMLDivElement>();
    const onLongPress = () => {
      console.log("长按");
    };
    const onTouchStart = (e: TouchEvent) => {
      currentTag.value = e.currentTarget as HTMLDivElement;
      timer.value = setTimeout(() => {
        onLongPress();
      }, 500);
    };
    const onTouchEnd = (e: TouchEvent) => {
      clearTimeout(timer.value);
    };
    const onTouchMove = (e: TouchEvent) => {
      const pointedElement = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (
        !currentTag.value?.contains(pointedElement) &&
        currentTag.value !== pointedElement
      ) {
        clearTimeout(timer.value);
      }
    };
    return () => (
      <>
        <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
          <RouterLink to={`/tags/create?kind=${props.kind}`} class={s.tag}>
            <div class={s.sign}>
              <Icon name="add" class={s.createTag} />
            </div>
            <div class={s.name}>新增</div>
          </RouterLink>
          {tags.value.map((tag) => (
            // 利用 v-model 绑定被选中的点击事件
            <div
              class={[s.tag, props.selected === tag.id ? s.selected : ""]}
              onClick={() => onSelect(tag)}
              // 长按编辑，监听长按时间
              onTouchstart={onTouchStart}
              onTouchend={onTouchEnd}
            >
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.name}>{tag.name}</div>
            </div>
          ))}
        </div>
        <div class={s.more}>
          {hasMore.value ? (
            <Button class={s.loadMore} onClick={fetchTags}>
              加载更多
            </Button>
          ) : (
            <span class={s.noMore}>没有更多</span>
          )}
        </div>
      </>
    );
  },
});
