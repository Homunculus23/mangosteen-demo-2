# 我的 Vue 3 + TSX 项目

本项目面向手机端设计，PC端适配较差。

## 编码规范

### ref默认值

推荐使用
```tsx
const div = ref<HTMLDivElement>()
```

不推荐使用
```tsx
const div = ref<HTMLDivElement|null>(null)
```