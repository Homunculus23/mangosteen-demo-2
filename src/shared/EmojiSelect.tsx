import { computed, defineComponent, PropType, ref } from "vue";
import { emojiList } from "./emojiList";
import s from "./EmojiSelect.module.scss";
export const EmojiSelect = defineComponent({
  props: {
    modelValue: {
      type: String, //required不写默认为false
    },
    onUpdateModelValue: {
      type: Function as PropType<(emoji: string) => void>,
    },
  },
  setup: (props, context) => {
    //初始化refSelected
    const refSelected = ref(0);
    const table: [string, string[]][] = [
      //这里用二维数组或对象都行
      [
        "表情",
        [
          "face-smiling",
          "face-affection",
          "face-tongue",
          "face-hand",
          "face-neutral-skeptical",
          "face-sleepy",
          "face-unwell",
          "face-hat",
          "face-glasses",
          "face-concerned",
          "face-negative",
          "face-costume",
        ],
      ],
      [
        "手势",
        [
          "hand-fingers-open",
          "hand-fingers-partial",
          "hand-single-finger",
          "hand-fingers-closed",
          "hands",
          "hand-prop",
          "body-parts",
        ],
      ],
      [
        "人物",
        [
          "person",
          "person-gesture",
          "person-role",
          "person-fantasy",
          "person-activity",
          "person-sport",
          "person-resting",
        ],
      ],
      ["衣服", ["clothing"]],
      [
        "动物",
        [
          "cat-face",
          "monkey-face",
          "animal-mammal",
          "animal-bird",
          "animal-amphibian",
          "animal-reptile",
          "animal-marine",
          "animal-bug",
        ],
      ],
      ["植物", ["plant-flower", "plant-other"]],
      ["自然", ["sky & weather", "science"]],
      ["食物", ["food-fruit", "food-vegetable", "food-prepared", "food-asian", "food-marine", "food-sweet"]],
      ["运动", ["sport", "game"]],
    ];
    const onClickTab = (index: number) => {
      refSelected.value = index;
    };
    const onClickEmoji = (emoji: string) => {
      if (props.onUpdateModelValue) {
        props.onUpdateModelValue(emoji);
      } else {
        context.emit("update:modelValue", emoji);
      }
    };
    //用 computed 类型提取的函数，在重新渲染页面时，依赖的值不变化就不会执行，比双重或多重 return 性能更好
    const emojis = computed(() => {
      //获取 refSelected.value 当前的值，将其对应的 table 的子数组赋予 selectedItem
      const selectedItem = table[refSelected.value][1];
      //基于table的分类名筛选emojiList，return分类名下所有的emoji；category：类别
      return selectedItem.map((category) =>
        //item是emoji组成的数组，find到的是数组里属于category类的emojis
        emojiList
          .find((item) => item[0] === category)?.[1]
          //对 emojis?.[1]（包含emoji本体的数组）进行map，显示 {item}
          .map((item) => (
            //到这里，最终返回的就是我们需要的 li 元素列表
            //将现在显示的 emoji 添加 class='selectedEmoji'，其他 emoji 均为 ''
            <li class={item === props.modelValue ? s.selectedEmoji : ""} onClick={() => onClickEmoji(item)}>
              {item}
            </li>
          ))
      );
    });
    return () => (
      <div class={s.emojiList}>
        <nav>
          {table.map(
            (
              item,
              index //map遍历table，获取 {item[0]} 显示在 nav 中；index 用于标记 onClickTab 所触发的 item
            ) => (
              //将现在显示的 emojis 所属的 item 添加 class='selected'，其他 item 为 ''
              <span
                class={index === refSelected.value ? s.selected : ""}
                //触发 onClickTab 时，将所点击的 index 赋予 refSelected.value
                onClick={() => onClickTab(index)}
              >
                {item[0]}
              </span>
            )
          )}
        </nav>
        <ol>{emojis.value}</ol>
      </div>
    );
  },
});
