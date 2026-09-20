import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';

export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
        >
          <button
            type="button"
            onClick={() => setEdges((edges) => edges.filter((edge) => edge.id !== id))}
            style={{
              cursor: 'pointer',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              background: '#fff',
              width: 22,
              height: 22,
              lineHeight: '18px',
            }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
