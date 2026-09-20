import { IFeature } from 'dumi-theme-antd-style';

export const featuresZh: IFeature[] = [
  {
    title: '可视化流程画布',
    description: '基于 React Flow 封装的通用流程画布，支持自定义节点、可删除连线、小地图与节点添加',
    image: '🎨',
    row: 6,
  },
  {
    title: '音频节点图',
    description:
      '基于 Web Audio API 的振荡器调音画布，支持振荡器、音量、输出节点的可视化连接与实时音频合成',
    image: '🎵',
    row: 6,
  },
  {
    title: '逻辑编排引擎',
    description:
      'DSL 驱动的逻辑编排引擎，支持 start / branch / behavior 节点执行与生命周期插件系统',
    image: '⚡',
    row: 6,
  },
];
