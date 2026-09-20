import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';
import { DeletableEdge } from './edges';
import { BlueNode, RedNode } from './nodes';
import './index.less';

const defaultNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, type: 'red', data: { label: '1' } },
  { id: '2', position: { x: 200, y: 300 }, type: 'blue', data: { label: '2' } },
];

const defaultEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'deletable' },
];

const nodeTypes = {
  red: RedNode,
  blue: BlueNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

export interface FlowProps {
  /** 画布宽度，默认 100% */
  width?: number | string;
  /** 画布高度，默认 500 */
  height?: number | string;
  /** 初始节点 */
  initialNodes?: Node[];
  /** 初始边 */
  initialEdges?: Edge[];
  /** 是否展示添加节点按钮 */
  showAddButton?: boolean;
  /** 添加节点时的默认文案 */
  addNodeLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

function Flow(props: FlowProps) {
  const {
    width = '100%',
    height = 500,
    initialNodes = defaultNodes,
    initialEdges = defaultEdges,
    showAddButton = true,
    addNodeLabel = '节点',
    className,
    style,
  } = props;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge({ ...params, type: 'deletable' }, eds));
  };

  const handleAddNode = () => {
    const id = Math.random().toString().slice(2, 6);
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: 'red',
        position: { x: 0, y: 0 },
        data: { label: addNodeLabel },
      },
    ]);
  };

  return (
    <div
      className={['ims-flow', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <MiniMap zoomable />
        <Background variant={BackgroundVariant.Lines} />
        {showAddButton ? (
          <Panel position="top-right">
            <button type="button" className="ims-flow-add-btn" onClick={handleAddNode}>
              添加节点
            </button>
          </Panel>
        ) : null}
      </ReactFlow>
    </div>
  );
}

export default Flow;
export { RedNode, BlueNode, DeletableEdge };
