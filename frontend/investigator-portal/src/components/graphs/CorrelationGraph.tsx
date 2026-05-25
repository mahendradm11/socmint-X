import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { IntelNode } from "./IntelNode";
import { graphEdges, graphNodes } from "@/data/mockIntelligence";
import { useIntelStore } from "@/store/useIntelStore";

const nodeTypes = { intel: IntelNode };

export function CorrelationGraph() {
  const focusMode = useIntelStore((s) => s.focusMode);
  const setSelectedNode = useIntelStore((s) => s.setSelectedNode);

  const [nodes, , onNodesChange] = useNodesState(graphNodes);
  const [edges, , onEdgesChange] = useEdgesState(graphEdges);

  const filteredEdges = useMemo(() => {
    if (!focusMode) return edges;
    return edges.filter((e) => (e.data?.confidence as number) >= 0.7);
  }, [edges, focusMode]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => setSelectedNode(node.id),
    [setSelectedNode]
  );

  return (
    <div className="h-[calc(100vh-220px)] min-h-[480px] w-full rounded-xl border border-white/[0.08] bg-navy-950/50">
      <ReactFlow
        nodes={nodes}
        edges={filteredEdges as Edge[]}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background color="rgba(30,107,255,0.15)" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={() => "#1e6bff"}
          maskColor="rgba(5,8,15,0.85)"
          className="!bg-navy-900 !border-white/10"
        />
      </ReactFlow>
    </div>
  );
}
