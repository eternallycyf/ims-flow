import { Context, createLogic, FLOW_SHAPES, Logic } from '../src/logic';

describe('Logic', () => {
  it('should create a Logic instance', () => {
    const logic = new Logic({
      dsl: { cells: [] },
      nodeFns: {},
    });
    expect(logic).toBeInstanceOf(Logic);
  });

  it('should register and invoke a start node', async () => {
    const logic = new Logic({
      dsl: {
        cells: [
          {
            id: 'start',
            shape: FLOW_SHAPES.START,
            data: { trigger: 'init', configData: { a: 1, b: 2 } },
          },
        ],
      },
      nodeFns: {
        start: (ctx) => {
          const { a, b } = ctx.getConfig() as { a: number; b: number };
          return a + b;
        },
      },
    });

    let result: unknown;
    await logic.invoke('init', {}, (ret) => {
      result = ret;
    });

    expect(result).toBe(3);
  });

  it('should execute a chain of nodes', async () => {
    const logic = new Logic({
      dsl: {
        cells: [
          { id: 'n1', shape: FLOW_SHAPES.START, data: { trigger: 'run' } },
          { id: 'n2', shape: FLOW_SHAPES.BEHAVIOR, data: {} },
          {
            id: 'e1',
            shape: 'edge',
            source: { cell: 'n1' },
            target: { cell: 'n2' },
          },
        ],
      },
      nodeFns: {
        n1: () => 5,
        n2: (ctx) => (ctx.getPipe() as number) * 2,
      },
    });

    let result: unknown;
    await logic.invoke('run', {}, (ret) => {
      result = ret;
    });

    expect(result).toBe(10);
  });
});

describe('Context', () => {
  it('should create a Context instance', () => {
    const ctx = new Context();
    expect(ctx).toBeInstanceOf(Context);
  });

  it('should manage context data', () => {
    const ctx = new Context();
    ctx.setContext({ foo: 'bar' });
    expect(ctx.getContext().foo).toBe('bar');
  });

  it('should freeze payload', () => {
    const ctx = new Context({ payload: { x: 1 } });
    expect(ctx.getPayload().x).toBe(1);
    expect(Object.isFrozen(ctx.getPayload())).toBe(true);
  });
});

describe('createLogic', () => {
  it('should create a Logic with DSL', async () => {
    const logic = createLogic({
      dsl: {
        cells: [
          {
            id: 'n1',
            shape: FLOW_SHAPES.START,
            data: { trigger: 'test', configData: { value: 7 } },
          },
        ],
      },
      nodeFns: {
        n1: (ctx) => {
          const { value } = ctx.getConfig() as { value: number };
          return value * 3;
        },
      },
    });

    let result: unknown;
    await logic.invoke('test', {}, (ret) => {
      result = ret;
    });

    expect(result).toBe(21);
  });
});

describe('FLOW_SHAPES', () => {
  it('should contain default shapes', () => {
    expect(FLOW_SHAPES.START).toBe('flow-start');
    expect(FLOW_SHAPES.BRANCH).toBe('flow-branch');
    expect(FLOW_SHAPES.BEHAVIOR).toBe('flow-behavior');
  });
});
