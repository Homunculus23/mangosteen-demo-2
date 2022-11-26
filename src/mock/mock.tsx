// 安装 faker：pnpm add @faker-js/faker
import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

// 根据实际业务需求，Mock 可能多达几百几千行，后面可能需要拆分，因此单独做一个文件夹
type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');

// 根据 config 返回不同的假数据，这里针对 /sign_in 的登录请求直接返回200和假 jwt
// export const mockSession: Mock = (config) => {
//   return [200, {
//     jwt: faker.random.word()
//   }]
// }

// item/create 页面调试
export const mockTagIndex: Mock = (config) => {
  const {kind, page} = config.params
  const per_page = 25
  const count = 26
  let id = 0
  const createId = () => {
    id += 1
    return id
  }
  const createPager = (page = 1) => ({
    page, per_page, count
  })
  const createTag = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      //.type 在JS以外的语言里通常是API，尽可能不要用 type 做key。最好用 kind 。
      kind: config.params.kind,
      ...attrs
    }))
  const createBody = (n = 1, attrs?: any) =>({
    resources: createTag(n), pager:createPager(page)
  })
  if (kind === 'expenses' && (page === 1 || !page)) {
    return [200, createBody(25)]
  } else if (kind === 'expenses' && page === 2) {
    return [200, createBody(1)]
  } else if (kind === 'income' && (page === 1 || !page)) {
    return [200, createBody(25)]
  } else {
    return [200, createBody(1)]
  }
}

// export const mockTagCreate: Mock = (config) => {
//     const json = JSON.parse(config.data)
//     console.log('session2')
//     return [200,{
//         resource: {
//             id: 1,
//             name: json.name,
//             sign: json.sign,
//             kind: json.kind
//         }
//     }]
// }

// export const mockItemCreate: Mock = (config) => {
//     return [200, {
//         resource: {
//             id: 1,
//             kind: 'expenses',
//             amount: 9900,
//             tags_id: [1],
//             happen_at: new Date().toISOString(),
//         }
//     }]
// }

// export const mockTagIndex: Mock = (config) => {
//     const { kind, page } = config.params
//     const per_page = 25
//     const count = 26
//     let id = 0
//     const createId = () => {
//       id += 1
//       return id
//     }
//     const createPaper = (page = 1) => ({
//       page, per_page, count
//     })
//     const createTag = (n = 1, attrs?: any) =>
//       Array.from({ length: n }).map(() => ({
//         id: createId(),
//         name: faker.lorem.word(),
//         sign: faker.internet.emoji(),
//         kind: config.params.kind,
//         ...attrs
//       }))
//     const createBody = (n = 1, attrs?: any) => ({
//       resources: createTag(n), pager: createPaper(page)
//     })
  
//     if (kind === 'expenses' && (!page || page === 1)) {
//       return [200, createBody(25)]
//     } else if (kind === 'expenses' && page === 2) {
//       return [200, createBody(1)]
//     } else if (kind === 'income' && (!page || page === 1)) {
//       return [200, createBody(25)]
//     } else {
//       return [200, createBody(1)]
//     }
// }