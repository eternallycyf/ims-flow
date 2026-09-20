import { Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';
import { toggleAudio } from '../audio';

export function OutputNode() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="ims-audio-flow-node ims-audio-flow-node--out">
      <Handle className="ims-audio-flow-handle" type="target" position={Position.Top} />
      <p>输出节点</p>
      <button
        type="button"
        className="ims-audio-flow-out-btn"
        onClick={() => {
          setIsRunning((prev) => !prev);
          toggleAudio();
        }}
      >
        {isRunning ? '播放中' : '已静音'}
      </button>
    </div>
  );
}
