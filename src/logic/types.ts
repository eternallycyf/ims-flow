import type Context from './Context';

export const FLOW_SHAPES = {
  START: 'flow-start',
  BRANCH: 'flow-branch',
  BEHAVIOR: 'flow-behavior',
} as const;

export type LifecycleName = 'ctxCreated' | 'enterNode' | 'leaveNode';

export type NodeFn = (ctx: Context) => Promise<unknown> | unknown;

export interface LogicPort {
  condition: string;
}

export interface LogicNodeData {
  trigger?: string;
  configData?: Record<string, unknown>;
  ports?: Record<string, LogicPort>;
}

export interface LogicNode {
  id: string;
  shape: string;
  data: LogicNodeData;
}

export interface LogicEdge {
  id: string;
  shape: 'edge';
  source: { cell: string; port?: string };
  target: { cell: string; port?: string };
}

export type LogicCell = LogicNode | LogicEdge;

export interface LogicDsl {
  cells: LogicCell[];
}

export interface LogicOptions {
  dsl: LogicDsl;
  nodeFns: Record<string, NodeFn>;
}

export type LifecyclePlugin = Partial<Record<LifecycleName, (ctx: Context) => void>>;
