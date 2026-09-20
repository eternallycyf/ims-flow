---
title: Logic
description: DSL 逻辑编排引擎，支持 start / branch / behavior 节点与生命周期插件
toc: content
group:
  title: 方法
  order: 3
demo:
  cols: 1
---

<code src="./demo/basic.tsx">执行逻辑流</code>

## 快速上手

```ts
import { createLogic, FLOW_SHAPES } from 'ims-flow';

const logic = createLogic({
  dsl: {
    cells: [
      { id: 'start', shape: FLOW_SHAPES.START, data: { trigger: 'start' } },
      { id: 'task', shape: FLOW_SHAPES.BEHAVIOR, data: {} },
      {
        id: 'e1',
        shape: 'edge',
        source: { cell: 'start' },
        target: { cell: 'task' },
      },
    ],
  },
  nodeFns: {
    start: async () => undefined,
    task: async (ctx) => {
      console.log(ctx.getPayload());
      return 'done';
    },
  },
});

await logic.invoke('start', { hello: 'world' });
```

## API

### createLogic / Logic

| 参数    | 说明               | 类型                     |
| ------- | ------------------ | ------------------------ |
| dsl     | 流程图 DSL         | `LogicDsl`               |
| nodeFns | 节点 id → 处理函数 | `Record<string, NodeFn>` |

### invoke

| 参数     | 说明                 | 类型                      |
| -------- | -------------------- | ------------------------- |
| trigger  | start 节点的 trigger | `string`                  |
| data     | 运行时 payload       | `Record<string, unknown>` |
| callback | 结束回调             | `(ret: unknown) => void`  |

### FLOW_SHAPES

- `flow-start`
- `flow-branch`
- `flow-behavior`
