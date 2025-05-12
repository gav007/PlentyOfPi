
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { GitFork, Waypoints } from 'lucide-react'; // Using GitFork for graphs

type GraphAlgorithmType = 'bfs' | 'dfs' | 'dijkstra';
const GRAPH_ALGORITHMS: { value: GraphAlgorithmType; label: string; description: string, complexity: string }[] = [
  { value: 'bfs', label: 'Breadth-First Search (BFS)', description: 'Explores neighbor nodes first, before moving to the next level neighbors. Uses a queue.', complexity: 'O(V+E)' },
  { value: 'dfs', label: 'Depth-First Search (DFS)', description: 'Explores as far as possible along each branch before backtracking. Uses a stack.', complexity: 'O(V+E)' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm", description: 'Finds the shortest path between nodes in a weighted graph. Uses a priority queue.', complexity: 'O(E log V) or O(V²)' },
];

// Placeholder for graph data structure
interface Node { id: string; x: number; y: number; }
interface Edge { source: string; target: string; weight?: number; }
interface GraphData { nodes: Node[]; edges: Edge[]; }

const sampleGraph: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 50 }, { id: 'B', x: 150, y: 50 }, { id: 'C', x: 50, y: 150 },
    { id: 'D', x: 150, y: 150 }, { id: 'E', x: 250, y: 100 }
  ],
  edges: [
    { source: 'A', target: 'B', weight: 1 }, { source: 'A', target: 'C', weight: 4 },
    { source: 'B', target: 'D', weight: 2 }, { source: 'C', target: 'D', weight: 3 },
    { source: 'B', target: 'E', weight: 7 }, { source: 'D', target: 'E', weight: 1 }
  ],
};


export default function GraphSearchVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<GraphAlgorithmType>('bfs');
  const [graphData, setGraphData] = useState<GraphData>(sampleGraph);
  const [startNode, setStartNode] = useState<string>('A');
  const [endNode, setEndNode] = useState<string>('E'); // For Dijkstra's
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  
  const algorithmDetails = GRAPH_ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const resetVisualization = useCallback(() => {
    // Potentially regenerate graph or reset node states
    setIsPlaying(false);
    setExplanation(algorithmDetails?.description || '');
  }, [algorithmDetails]);

  useEffect(() => {
    resetVisualization();
  }, [selectedAlgorithm, resetVisualization]);
  
  useEffect(() => {
    setExplanation(algorithmDetails?.description || '');
  }, [selectedAlgorithm, algorithmDetails]);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <GitFork className="w-7 h-7 text-primary"/> Graph Traversal Visualizer
        </CardTitle>
        <CardDescription>Explore BFS, DFS, and Dijkstra's algorithm on a graph.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="graph-algo-select" className="text-sm font-medium">Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={(val) => setSelectedAlgorithm(val as GraphAlgorithmType)}>
              <SelectTrigger id="graph-algo-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRAPH_ALGORITHMS.map(algo => <SelectItem key={algo.value} value={algo.value}>{algo.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="start-node-select" className="text-sm font-medium">Start Node</Label>
            <Select value={startNode} onValueChange={setStartNode}>
                <SelectTrigger id="start-node-select"><SelectValue/></SelectTrigger>
                <SelectContent>{graphData.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {selectedAlgorithm === 'dijkstra' && (
            <div>
                <Label htmlFor="end-node-select" className="text-sm font-medium">End Node</Label>
                <Select value={endNode} onValueChange={setEndNode}>
                    <SelectTrigger id="end-node-select"><SelectValue/></SelectTrigger>
                    <SelectContent>{graphData.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>)}</SelectContent>
                </Select>
            </div>
          )}
           {/* Add Graph selection/editor button here later */}
        </div>

        <ArenaCanvas className="min-h-[350px] relative">
            {/* Basic SVG rendering of graph */}
            <svg width="100%" height="100%" viewBox="0 0 300 200">
                {graphData.edges.map((edge, i) => (
                    <line
                        key={`edge-${i}`}
                        x1={graphData.nodes.find(n => n.id === edge.source)?.x}
                        y1={graphData.nodes.find(n => n.id === edge.source)?.y}
                        x2={graphData.nodes.find(n => n.id === edge.target)?.x}
                        y2={graphData.nodes.find(n => n.id === edge.target)?.y}
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="1"
                    />
                ))}
                 {graphData.edges.map((edge, i) => edge.weight && (
                    <text
                        key={`weight-${i}`}
                        x={(graphData.nodes.find(n => n.id === edge.source)!.x + graphData.nodes.find(n => n.id === edge.target)!.x) / 2 + 2}
                        y={(graphData.nodes.find(n => n.id === edge.source)!.y + graphData.nodes.find(n => n.id === edge.target)!.y) / 2 - 2}
                        fontSize="8" fill="hsl(var(--foreground))"
                    >
                        {edge.weight}
                    </text>
                 ))}
                {graphData.nodes.map(node => (
                    <g key={node.id}>
                        <circle cx={node.x} cy={node.y} r="10" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
                        <text x={node.x} y={node.y} dy="3" textAnchor="middle" fontSize="8" fill="hsl(var(--primary-foreground))">{node.id}</text>
                    </g>
                ))}
            </svg>
             <p className="absolute bottom-2 right-2 text-xs text-muted-foreground">Graph visualization placeholder. Interactive elements to be added.</p>
        </ArenaCanvas>
        
        <ArenaControls
            onPlay={() => setIsPlaying(true)} // Placeholder
            onPause={() => setIsPlaying(false)} // Placeholder
            onReset={resetVisualization}
            isPlaying={isPlaying}
            onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={algorithmDetails?.label || "Algorithm Explanation"}
          currentStepExplanation={
             <>
              <p className="font-semibold">How it works:</p>
              <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm.'}</p>
              <p className="font-semibold">Complexity:</p>
              <p className="text-xs">{algorithmDetails?.complexity || '-'}</p>
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
