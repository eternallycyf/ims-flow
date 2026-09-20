import React from 'react';
import { createLogic, FLOW_SHAPES, type LogicDsl, type NodeFn } from '../../logic';

const dsl: LogicDsl = {
  cells: [
    {
      id: 'start',
      shape: FLOW_SHAPES.START,
      data: { trigger: 'start', configData: {} },
    },
    {
      id: 'branch',
      shape: FLOW_SHAPES.BRANCH,
      data: {
        configData: {},
        ports: {
          right: { condition: 'true' },
          bottom: { condition: 'false' },
        },
      },
    },
    {
      id: 'ok',
      shape: FLOW_SHAPES.BEHAVIOR,
      data: { configData: {} },
    },
    {
      id: 'fail',
      shape: FLOW_SHAPES.BEHAVIOR,
      data: { configData: {} },
    },
    {
      id: 'e1',
      shape: 'edge',
      source: { cell: 'start', port: 'right' },
      target: { cell: 'branch', port: 'left' },
    },
    {
      id: 'e2',
      shape: 'edge',
      source: { cell: 'branch', port: 'right' },
      target: { cell: 'ok', port: 'left' },
    },
    {
      id: 'e3',
      shape: 'edge',
      source: { cell: 'branch', port: 'bottom' },
      target: { cell: 'fail', port: 'top' },
    },
  ],
};

const nodeFns: Record<string, NodeFn> = {
  start: async () => undefined,
  branch: async () => true,
  ok: async (ctx) => {
    ctx.setContext({ result: 'logged-in path' });
    return 'ok';
  },
  fail: async (ctx) => {
    ctx.setContext({ result: 'guest path' });
    return 'fail';
  },
};

export interface LogicDemoProps {
  trigger?: string;
}

export default function LogicDemo(props: LogicDemoProps) {
  const { trigger = 'start' } = props;
  const [logs, setLogs] = React.useState<string[]>([]);

  const run = async () => {
    const nextLogs: string[] = [];
    const logic = createLogic({ dsl, nodeFns });
    logic.use(() => ({
      enterNode: (ctx) => {
        nextLogs.push(`enter: ${ctx.curNode?.id}`);
      },
      leaveNode: (ctx) => {
        nextLogs.push(`leave: ${ctx.curNode?.id}`);
      },
    }));

    await logic.invoke(trigger, { user: 'demo' }, (ret) => {
      nextLogs.push(`done: ${String(ret)}`);
      nextLogs.push(`context: ${JSON.stringify(logic._getUnsafeCtx()?.getContext())}`);
    });
    setLogs(nextLogs);
  };

  return (
    <div style={{ padding: 12 }}>
      <button type="button" onClick={run}>
        执行逻辑流
      </button>
      <pre style={{ marginTop: 12, background: '#f6f8fa', padding: 12 }}>
        {logs.length ? logs.join('\n') : '点击按钮执行 DSL 逻辑流'}
      </pre>
    </div>
  );
}
