import EventEmitter from 'eventemitter3';
import Context from './Context';
import {
  FLOW_SHAPES,
  type LifecycleName,
  type LifecyclePlugin,
  type LogicCell,
  type LogicEdge,
  type LogicNode,
  type LogicOptions,
  type NodeFn,
} from './types';

const LIFECYCLE = new Set<LifecycleName>(['ctxCreated', 'enterNode', 'leaveNode']);

function isEdge(cell: LogicCell): cell is LogicEdge {
  return cell.shape === 'edge';
}

export default class Logic extends EventEmitter {
  dsl: LogicOptions['dsl'];
  nodeFns: Record<string, NodeFn>;
  lifeCycleEvents: Partial<Record<LifecycleName, Array<(ctx: Context) => void>>> = {};
  private _unsafeCtx?: Context;

  constructor(opts: LogicOptions) {
    super();
    this.dsl = opts.dsl;
    this.nodeFns = opts.nodeFns;
  }

  get cells() {
    return this.dsl.cells;
  }

  get nodes(): LogicNode[] {
    return this.cells.filter((cell): cell is LogicNode => !isEdge(cell));
  }

  get startNodes(): LogicNode[] {
    return this.nodes.filter((cell) => cell.shape === FLOW_SHAPES.START);
  }

  get edges(): LogicEdge[] {
    return this.cells.filter(isEdge);
  }

  _getUnsafeCtx() {
    return this._unsafeCtx;
  }

  _runLifecycleEvent(eventName: LifecycleName, ctx: Context) {
    if (!LIFECYCLE.has(eventName)) {
      console.warn(`Lifecycle ${eventName} is not supported!`);
      return;
    }
    this.lifeCycleEvents[eventName]?.forEach((fn) => fn(ctx));
  }

  _createCtx(opts: { payload?: Record<string, unknown> }) {
    const ctx = new Context(opts);
    ctx.emit = this.emit.bind(this) as unknown as (...args: unknown[]) => boolean;
    this._runLifecycleEvent('ctxCreated', ctx);
    return ctx;
  }

  _getStartNode(trigger: string) {
    return this.startNodes.find((cell) => cell.data.trigger === trigger);
  }

  _getNextNodes(ctx: Context, curNode: LogicNode, curRet: unknown) {
    const next: LogicNode[] = [];
    const isBranch = curNode.shape === FLOW_SHAPES.BRANCH;
    let matchedPort = '';

    if (isBranch) {
      const ports = curNode.data.ports || {};
      for (const key of Object.keys(ports)) {
        const { condition } = ports[key];
        // eslint-disable-next-line no-new-func
        const ret = new Function('ctx', `return ${condition}`)(ctx);
        if (ret === Boolean(curRet)) {
          matchedPort = key;
          break;
        }
      }
    }

    for (const edge of this.edges) {
      const isMatchedSource = edge.source.cell === curNode.id;
      const isMatchedPort = !isBranch || edge.source.port === matchedPort;
      if (isMatchedSource && isMatchedPort) {
        const nextNode = this.nodes.find((item) => item.id === edge.target.cell);
        if (nextNode) next.push(nextNode);
      }
    }
    return next;
  }

  use(pluginCreator: (logic: Logic) => LifecyclePlugin) {
    if (typeof pluginCreator !== 'function') {
      console.error('Logic plugin must be a function.');
      return;
    }
    const plugin = pluginCreator(this);
    if (typeof plugin !== 'object' || plugin === null) {
      console.error('Logic plugin must return an object.');
      return;
    }
    (Object.keys(plugin) as LifecycleName[]).forEach((eventName) => {
      if (!LIFECYCLE.has(eventName)) {
        console.warn(`Lifecycle ${eventName} is not supported.`);
        return;
      }
      if (!this.lifeCycleEvents[eventName]) {
        this.lifeCycleEvents[eventName] = [];
      }
      const handler = plugin[eventName];
      if (handler) {
        this.lifeCycleEvents[eventName]!.push(handler);
      }
    });
  }

  async _execNode(
    ctx: Context,
    curNode: LogicNode,
    lastRet: unknown,
    callback?: (ret: unknown) => void,
  ) {
    ctx._transitTo(curNode, lastRet);
    const fn = this.nodeFns[curNode.id];
    this._runLifecycleEvent('enterNode', ctx);
    const curRet = fn ? await fn(ctx) : undefined;
    this._runLifecycleEvent('leaveNode', ctx);

    let pipeRet = lastRet;
    if (curNode.shape !== FLOW_SHAPES.BRANCH) {
      pipeRet = curRet;
    }

    const nextNodes = this._getNextNodes(ctx, curNode, curRet);
    if (nextNodes.length > 0) {
      await Promise.all(nextNodes.map((node) => this._execNode(ctx, node, pipeRet, callback)));
    } else {
      callback?.(pipeRet);
    }
  }

  async invoke(trigger: string, data?: Record<string, unknown>, callback?: (ret: unknown) => void) {
    const curNode = this._getStartNode(trigger);
    if (!curNode) {
      return Promise.reject(new Error(`Invoke failed! No flow-start named ${trigger} found!`));
    }
    this._unsafeCtx = this._createCtx({ payload: data });
    await this._execNode(this._unsafeCtx, curNode, undefined, callback);
  }
}

export function createLogic(opts: LogicOptions) {
  return new Logic(opts);
}
