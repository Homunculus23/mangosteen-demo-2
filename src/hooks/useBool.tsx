import { ref } from "vue";

export const useBool = (initialValue: boolean) => {
  const bool = ref(initialValue);
  return {
    ref: bool,
    // 对 bool 进行取反
    toggle: () => (bool.value = !bool.value),
    // 将 bool 值变为 true
    on: () => (bool.value = true),
    // 将 bool 值变为 false
    off: () => (bool.value = false),
  };
};
