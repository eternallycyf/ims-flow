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
import React, { useEffect } from 'react';
import { connect, createAudioNode, ensureSeedNodes } from './audio';
import './index.less';
import { OscillatorNode } from './nodes/OscillatorNode';
import { OutputNode } from './nodes/OutputNode';
import { VolumeNode } from './nodes/VolumeNode';

const initialNodes: Node[] = [
  {
    id: 'a',
    type: 'osc',
    data: { frequency: 220, type: 'square' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'b',
    type: 'volume',
    data: { gain: 0.5 },
    position: { x: 150, y: 250 },
  },
  {
    id: 'c',
    type: 'out',
    data: {},
    position: { x: 350, y: 400 },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  osc: OscillatorNode,
  volume: VolumeNode,
  out: OutputNode,
};

export interface AudioFlowProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

function AudioFlow(props: AudioFlowProps) {
  const { width = '100%', height = 560, className, style } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    ensureSeedNodes();
  }, []);

  const onConnect = (params: Connection) => {
    if (params.source && params.target) {
      connect(params.source, params.target);
    }
    setEdges((eds) => addEdge(params, eds));
  };

  const addOscNode = () => {
    const id = Math.random().toString().slice(2, 8);
    const data = { frequency: 400, type: 'sine' };
    setNodes((prev) => [...prev, { id, type: 'osc', data, position: { x: 0, y: 0 } }]);
    createAudioNode(id, 'osc', data);
  };

  const addVolumeNode = () => {
    const id = Math.random().toString().slice(2, 8);
    const data = { gain: 0.5 };
    setNodes((prev) => [...prev, { id, type: 'volume', data, position: { x: 0, y: 0 } }]);
    createAudioNode(id, 'volume', data);
  };

  return (
    <div
      className={['ims-audio-flow', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} />
        <Panel position="top-right" className="ims-audio-flow-panel">
          <button type="button" onClick={addOscNode}>
            添加振荡器节点
          </button>
          <button type="button" onClick={addVolumeNode}>
            添加音量节点
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default AudioFlow;
export { OscillatorNode, OutputNode, VolumeNode };
