// 安装 faker：pnpm add @faker-js/faker
import { faker } from "@faker-js/faker";
import { AxiosRequestConfig } from "axios";

// 根据实际业务需求，Mock 可能多达几百几千行，后面可能需要拆分，因此单独做一个文件夹
type Mock = (config: AxiosRequestConfig) => [number, any];

faker.setLocale("zh_CN");

// 根据 config 返回不同的假数据，这里针对 /sign_in 的登录请求直接返回200和假 jwt
export const mockSession: Mock = (config) => {
  return [
    200,
    {
      jwt: faker.random.word(),
    },
  ];
};

// item/create 页面调试
let id = 0;
const createId = () => {
  id += 1;
  return id;
};
export const mockTagIndex: Mock = (config) => {
  const { kind, page } = config.params;
  const per_page = 25;
  const count = 26;
  const createPager = (page = 1) => ({
    page,
    per_page,
    count,
  });
  const createTag = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      //.type 在JS以外的语言里通常是API，尽可能不要用 type 做key。最好用 kind 。
      kind: config.params.kind,
      ...attrs,
    }));
  const createBody = (n = 1, attrs?: any) => ({
    resources: createTag(n),
    pager: createPager(page),
  });
  if (kind === "expenses" && (page === 1 || !page)) {
    return [200, createBody(25)];
  } else if (kind === "expenses" && page === 2) {
    return [200, createBody(1)];
  } else if (kind === "income" && (page === 1 || !page)) {
    return [200, createBody(25)];
  } else {
    return [200, createBody(1)];
  }
};
export const mockTagShow: Mock = (config) => {
  const createTag = (attrs?: any) => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: "expenses",
    ...attrs,
  });
  return [200, { resource: createTag() }];
};
// ？老师为什么要加个一模一样的？
export const mockTagEdit: Mock = mockTagShow;
export const mockTagCreate: Mock = (config) => {
  const json = JSON.parse(config.data);
  return [
    200,
    {
      resource: {
        id: 1,
        name: json.name,
        sign: json.sign,
        kind: json.kind,
      },
    },
  ];
};

export const mockItemCreate: Mock = (config) => {
  // 测试报错
  // return [422, {
  //   errors: {
  //     tags_id: ['必须选择标签'],
  //     amount: ['金额不能为0']
  //   }
  // }]
  return [
    200,
    {
      resource: {
        id: 1,
        user_id: 1312,
        amount: 9900,
        note: null,
        tags_id: [1],
        happen_at: new Date().toISOString(),
        kind: "expenses",
      },
    },
  ];
};

export const mockItemIndex: Mock = (config) => {
  const { kind, page } = config.params;
  const per_page = 25;
  const count = 26;
  const createPaper = (page = 1) => ({
    page,
    per_page,
    count,
  });
  const createTag = (attrs?: any) => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: "expenses",
    ...attrs,
  });
  const createItem = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      user_id: createId(),
      amount: Math.floor(Math.random() * 10000),
      tags_id: [createId()],
      tags: [createTag()],
      happen_at: faker.date.past().toISOString(),
      kind: config.params.kind,
    }));
  const createBody = (n = 1, attrs?: any) => ({
    resources: createItem(n),
    pager: createPaper(page),
    // 收入/支出/净收入
    summary: {
      income: 9900,
      expenses: 10800,
      balance: -900,
    },
  });
  if (!page || page === 1) {
    return [200, createBody(25)];
  } else if (page === 2) {
    return [200, createBody(1)];
  } else {
    return [200, {}];
  }
};
// mock收、支、净收入统计
export const mockItemIndexBalance: Mock = (config) => {
  return [
    200,
    {
      income: 9900,
      expenses: 10800,
      balance: -900,
    },
  ];
};
// 折线、饼、条形三图
export const mockItemSummary: Mock = (config) => {
  if (config.params.group_by === "happen_at") {
    return [
      200,
      {
        groups: [
          { happen_at: "2022-07-18T00:00:00.000+0800", amount: 100 },
          { happen_at: "2022-07-22T00:00:00.000+0800", amount: 300 },
          { happen_at: "2022-07-29T00:00:00.000+0800", amount: 200 },
        ],
        summary: 600,
      },
    ];
  } else {
    return [
      200,
      {
        groups: [
          { tag_id: 1, tag: { id: 1, name: "交通" }, amount: 100 },
          { tag_id: 2, tag: { id: 2, name: "吃饭" }, amount: 300 },
          { tag_id: 3, tag: { id: 3, name: "购物" }, amount: 200 },
        ],
        summary: 600,
      },
    ];
  }
};
