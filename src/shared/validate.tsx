//声明formData的类型FData，Record可以视为普通对象。FData需要循环引用自身，因此用interface来声明
interface FData {
    [k: string]: string|number|null|undefined|FData
}
type Rule<T> = {
    key: keyof T
    message: string
} & (
    { type: 'required' } | 
    { type: 'pattern', regex: RegExp}
)
type Rules<T> = Rule<T>[]
//为了保证rules的key属于formData的子集，使用泛型<T>来指代FData，并依次将 T 传递给 type Rules -> type Rule -> key
export type { Rules, Rule, FData }
export const validate = <T extends FData>(formData: T, rules: Rules<T>) => {
    //type Errors 的 k 属于 T 的 key ，[] 后的 ? 使这些 key 从必选变为可选
    type Errors = {
        [k in keyof T]?: string[]
    }
    const errors: Errors = {}
    //forEach() 也可以换成 map()，但由于后者会自动运算出返回值（即使不用变量接收这个返回值时会被抛弃），因此其资源消耗略高于前者
    rules.forEach(rule => {
        const { key, type, message } = rule
        const value = formData[key]
        switch(type){
            case 'required': 
                if(value === null || value === undefined || value === ''){
                    //双问号用法与||极为相似，可网络搜索关键词，然后查看搜到的第一篇博客：双问号语法 方应航
                    errors[key] = errors[key] ?? []
                    errors[key]?.push(message)
                }
                break;
            case 'pattern': 
                if(value && !rule.regex.test(value.toString())){
                    errors[key] = errors[key] ?? []
                    errors[key]?.push(message)
                }
                break;
            default: 
                return;
        }
    })
    return errors
}