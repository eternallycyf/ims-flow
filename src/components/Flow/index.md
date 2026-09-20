---
title: Flow
description: 可视化流程画布，支持自定义节点、可删除连线、小地图与添加节点
toc: content
group:
  title: 组件
  order: 1
demo:
  cols: 1
---

<code src="./demo/basic.tsx">基础用法</code>

## API

| 参数          | 说明                 | 类型               | 默认值   |
| ------------- | -------------------- | ------------------ | -------- |
| width         | 画布宽度             | `number \| string` | `100%`   |
| height        | 画布高度             | `number \| string` | `500`    |
| initialNodes  | 初始节点             | `Node[]`           | 内置示例 |
| initialEdges  | 初始边               | `Edge[]`           | 内置示例 |
| showAddButton | 是否展示添加节点按钮 | `boolean`          | `true`   |
| addNodeLabel  | 新增节点默认文案     | `string`           | `节点`   |
| className     | 自定义类名           | `string`           | -        |
| style         | 自定义样式           | `CSSProperties`    | -        |
