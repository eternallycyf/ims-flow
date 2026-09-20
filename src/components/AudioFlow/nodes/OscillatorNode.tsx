import { Handle, Position } from '@xyflow/react';
import React, { useState, type ChangeEventHandler } from 'react';
import { updateAudioNode } from '../audio';

export interface OscillatorNodeProps {
  id: string;
  data: {
    frequency: number;
    type: string;
  };
}

export function OscillatorNode({ id, data }: OscillatorNodeProps) {
  const [frequency, setFrequency] = useState(data.frequency);
  const [type, setType] = useState(data.type);

  const changeFrequency: ChangeEventHandler<HTMLInputElement> = (e) => {
    const next = +e.target.value;
    setFrequency(next);
    updateAudioNode(id, { frequency: next });
  };

  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setType(e.target.value);
    updateAudioNode(id, { type: e.target.value });
  };

  return (
    <div className="ims-audio-flow-node">
      <p className="ims-audio-flow-node__title ims-audio-flow-node__title--osc">振荡器节点</p>
      <div className="ims-audio-flow-node__body">
        <span>频率</span>
        <input
          className="nodrag"
          type="range"
          min={10}
          max={1000}
          value={frequency}
          onChange={changeFrequency}
        />
        <span className="ims-audio-flow-node__right">{frequency} Hz</span>
      </div>
      <hr />
      <div className="ims-audio-flow-node__body">
        <p>波形</p>
        <select value={type} onChange={changeType}>
          <option value="sine">正弦波</option>
          <option value="triangle">三角波</option>
          <option value="sawtooth">锯齿波</option>
          <option value="square">方波</option>
        </select>
      </div>
      <Handle className="ims-audio-flow-handle" type="source" position={Position.Bottom} />
    </div>
  );
}
