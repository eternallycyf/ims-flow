---
title: AudioFlow
description: 基于 React Flow 的 Web Audio 振荡器调音画布
toc: content
group:
  title: 组件
  order: 2
demo:
  cols: 1
---

<code src="./demo/basic.tsx">振荡器调音</code>

## 说明

将振荡器、音量、输出节点连线后，点击输出节点即可播放。浏览器通常要求用户手势后才能启动 AudioContext。

## API

| 参数      | 说明       | 类型               | 默认值 |
| --------- | ---------- | ------------------ | ------ |
| width     | 画布宽度   | `number \| string` | `100%` |
| height    | 画布高度   | `number \| string` | `560`  |
| className | 自定义类名 | `string`           | -      |
| style     | 自定义样式 | `CSSProperties`    | -      |
