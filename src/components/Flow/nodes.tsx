import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

export type LabelNodeData = {
  label: string;
};

export function RedNode({ data }: NodeProps) {
  const label = (data as LabelNodeData).label;
  return (
    <div
      style={{
        background: '#e5484d',
        width: 100,
        height: 100,
        textAlign: 'center',
        color: '#fff',
        lineHeight: '100px',
        borderRadius: 4,
      }}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <div>{label}</div>
    </div>
  );
}

export function BlueNode({ data }: NodeProps) {
  const label = (data as LabelNodeData).label;
  return (
    <div
      style={{
        background: '#3b82f6',
        width: 50,
        height: 50,
        textAlign: 'center',
        color: '#fff',
        lineHeight: '50px',
        borderRadius: 4,
      }}
    >
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
    </div>
  );
}
