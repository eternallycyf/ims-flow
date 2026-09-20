import { Handle, Position } from '@xyflow/react';
import React, { useState, type ChangeEventHandler } from 'react';
import { updateAudioNode } from '../audio';

export interface VolumeNodeProps {
  id: string;
  data: {
    gain: number;
  };
}

export function VolumeNode({ id, data }: VolumeNodeProps) {
  const [gain, setGain] = useState(data.gain);

  const changeGain: ChangeEventHandler<HTMLInputElement> = (e) => {
    const next = +e.target.value;
    setGain(next);
    updateAudioNode(id, { gain: next });
  };

  return (
    <div className="ims-audio-flow-node">
      <Handle className="ims-audio-flow-handle" type="target" position={Position.Top} />
      <p className="ims-audio-flow-node__title ims-audio-flow-node__title--volume">音量节点</p>
      <div className="ims-audio-flow-node__body">
        <p>Gain</p>
        <input
          className="nodrag"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={changeGain}
        />
        <p className="ims-audio-flow-node__right">{gain.toFixed(2)}</p>
      </div>
      <Handle className="ims-audio-flow-handle" type="source" position={Position.Bottom} />
    </div>
  );
}
