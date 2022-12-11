//声明formData的类型FData，Record可以视为普通对象。FData需要循环引用自身，因此用interface来声明
interface FData {
  // [k: string]: string | number | null | undefined | FData;
  [k: string]: JSONValue;
}
type Rule<T> = {
  key: keyof T;
  message: string;
} & ({ type: "required" } | { type: "pattern"; regex: RegExp } | { type: "notEqual"; value: JSONValue });
type Rules<T> = Rule<T>[];
//为了保证rules的key属于formData的子集，使用泛型<T>来指代FData，并依次将 T 传递给 type Rules -> type Rule -> key
export type { Rules, Rule, FData };
export const validate = <T extends FData>(formData: T, rules: Rules<T>) => {
  //type Errors 的 k 属于 T 的 key ，[] 后的 ? 使这些 key 从必选变为可选
  type Errors = {
    [k in keyof T]?: string[];
  };
  const errors: Errors = {};
  //forEach() 也可以换成 map()，但由于后者会自动运算出返回值（即使不用变量接收这个返回值时会被抛弃），因此其资源消耗略高于前者
  rules.forEach((rule) => {
    const { key, type, message } = rule;
    const value = formData[key];
    switch (type) {
      case "required":
        if (value === null || value === undefined || value === "") {
          //双问号用法与||极为相似，可网络搜索关键词，然后查看搜到的第一篇博客：双问号语法 方应航
          errors[key] = errors[key] ?? [];
          errors[key]?.push(message);
        }
        break;
      case "pattern":
        if (value && !rule.regex.test(value.toString())) {
          errors[key] = errors[key] ?? [];
          errors[key]?.push(message);
        }
        break;
      case "notEqual":
        if (!isEmpty(value) && value === rule.value) {
          errors[key] = errors[key] ?? [];
          errors[key]?.push(message);
        }
        break;
      default:
        return;
    }
  });
  return errors;
};
function isEmpty(value: null | undefined | string | number | FData) {
  return value === null || value === undefined || value === "";
}
export function hasError(errors: Record<string, string[]>) {
  let result = false;
  for (let key in errors) {
    if (errors[key]?.length > 0) {
      result = true;
      break;
    }
  }
  return result;
  // 不用 let 的写法，思路是对 errors.value 进行遍历，获得其 value 之和，结果大于0说明有错误
  // return Object.values(errors).reduce((result, value) => result + value.length, 0) > 0
  // 上行代码有2个问题：1.对于新手来说可读性较差；2.它一定会遍历每一项，导致性能不如上面的代码（errors其实没多大，省不了几个性能），想规避这个问题可用 some 代替 reduce 进行遍历。
}
