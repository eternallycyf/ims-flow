import type { LogicNode, LogicNodeData } from './types';

export interface ContextOptions {
  payload?: Record<string, unknown>;
}

export default class Context {
  curNode: LogicNode | null = null;
  context: Record<string, unknown> = {};
  payload: Readonly<Record<string, unknown>> = Object.freeze({});
  lastRet: unknown;
  emit?: (...args: unknown[]) => boolean;

  constructor(opts: ContextOptions = {}) {
    this._init(opts);
  }

  _init(opts: ContextOptions = {}) {
    const { payload = {} } = opts;
    this.curNode = null;
    this.context = {};
    this.payload = Object.freeze({ ...payload });
  }

  _transitTo(node: LogicNode, lastRet: unknown) {
    this.curNode = node;
    this.lastRet = lastRet;
  }

  getConfig(): LogicNodeData['configData'] {
    return this.curNode?.data.configData;
  }

  getPayload() {
    return this.payload;
  }

  getPipe() {
    return this.lastRet;
  }

  getContext() {
    return this.context;
  }

  setContext(data: Record<string, unknown> = {}) {
    Object.keys(data).forEach((key) => {
      this.context[key] = data[key];
    });
  }
}
