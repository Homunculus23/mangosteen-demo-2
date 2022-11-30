/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 全局引用声明
type JSONValue =
  | null
  | boolean
  | string
  | number
  | JSONValue[]
  | Record<string, JSONValue>;

type Tag = {
  id: number;
  user_id: number;
  name: string;
  sign: string;
  kind: "expenses" | "income";
};

// Item 的类型可以看后端文档，或者直接问
type Item = {
  id: number;
  user_id: number;
  amount: number;
  tags_id: number[];
  happen_at: string;
  kind: "expenses" | "income";
};

type Resources<T = any> = {
  resources: T[];
  pager: {
    page: number; // 如果后端不靠谱也没法沟通, page偶尔传空, 只能在number后面加上 | null ,后面用到page的地方再做判断
    per_page: number;
    count: number;
  };
};

type Resource<T> = {
  resource: T;
};

type ResourceError = {
  errors: Record<string, string[]>;
};
