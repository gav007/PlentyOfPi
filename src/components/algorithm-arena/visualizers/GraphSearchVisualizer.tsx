
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import ComplexityDisplay from '@/components/algorithm-arena/shared/ComplexityDisplay';
import { GitFork, Waypoints, Play, Pause, SkipForward, RotateCcw, FastForward, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type GraphAlgorithmType = 'bfs' | 'dfs' | 'dijkstra';

interface Node { id: string; x: number; y: number; label?: string; }
interface Edge { source: string; target: string; weight?: number; id: string; }
interface GraphData { nodes: Node[]; edges: Edge[]; }

interface GraphSearchStep {
  explanation: string;
  visited: Set<string>;
  queue?: string[];
  stack?: string[];
  distances?: Map<string, number>;
  parents?: Map<string, string | null>;
  currentNode?: string;
  processingNeighborsOf?: string;
  highlightedEdge?: { source: string; target: string };
  finalPath?: string[];
  searchComplete?: boolean;
  message?: string;
  priorityQueueSnapshot?: {node: string, distance: number}[]; // For Dijkstra's priority queue visualization
}

const GRAPH_ALGORITHMS: { value: GraphAlgorithmType; label: string; description: string, timeComplexity: string, spaceComplexity: string }[] = [
  { value: 'bfs', label: 'Breadth-First Search (BFS)', description: 'Explores neighbor nodes first, before moving to the next level neighbors. Uses a queue.', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { value: 'dfs', label: 'Depth-First Search (DFS)', description: 'Explores as far as possible along each branch before backtracking. Uses a stack.', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm", description: 'Finds the shortest path between nodes in a weighted graph. Uses a priority queue.', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V+E)' },
];

const sampleGraph: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 100, label: 'A' }, { id: 'B', x: 150, y: 50, label: 'B' }, { id: 'C', x: 150, y: 150, label: 'C' },
    { id: 'D', x: 250, y: 50, label: 'D' }, { id: 'E', x: 250, y: 150, label: 'E' }, { id: 'F', x: 350, y: 100, label: 'F' }
  ],
  edges: [
    { source: 'A', target: 'B', weight: 1, id: 'A-B' }, { source: 'A', target: 'C', weight: 4, id: 'A-C' },
    { source: 'B', target: 'D', weight: 2, id: 'B-D' }, { source: 'C', target: 'E', weight: 3, id: 'C-E' },
    { source: 'D', target: 'E', weight: 1, id: 'D-E' }, { source: 'D', target: 'F', weight: 5, id: 'D-F' },
    { source: 'E', target: 'F', weight: 1, id: 'E-F' },
  ],
};

const BASE_ANIMATION_DELAY_MS_GRAPH = 800;

function buildAdjacencyList(graph: GraphData): Map<string, {neighbor: string, weight:number}[]> {
  const adj = new Map<string, {neighbor: string, weight:number}[]>();
  graph.nodes.forEach(node => adj.set(node.id, []));
  graph.edges.forEach(edge => {
    adj.get(edge.source)?.push({neighbor: edge.target, weight: edge.weight ?? 1}); // Default weight 1 if undefined
    // For undirected graphs, add reverse edge if not already present or if specific structure
    if (!adj.get(edge.target)?.find(e => e.neighbor === edge.source)) {
        adj.get(edge.target)?.push({neighbor: edge.source, weight: edge.weight ?? 1});
    }
  });
  return adj;
}

function reconstructPath(parents: Map<string, string | null>, startNodeId: string, endNodeId: string): string[] {
    const path: string[] = [];
    let current: string | null = endNodeId;
    while(current) {
        path.unshift(current);
        if (current === startNodeId) break;
        current = parents.get(current) || null;
    }
    return (path.length > 0 && path[0] === startNodeId) ? path : [];
}


function bfsSteps(graph: GraphData, startNodeId: string, endNodeId?: string): GraphSearchStep[] {
  const steps: GraphSearchStep[] = [];
  const adj = buildAdjacencyList(graph);
  const queue: string[] = [];
  const visited = new Set<string>();
  const parents = new Map<string, string | null>();

  if (!graph.nodes.find(n => n.id === startNodeId)) {
    steps.push({ explanation: `Start node ${startNodeId} not found.`, visited, searchComplete: true, message: "Start node invalid."});
    return steps;
  }

  queue.push(startNodeId);
  visited.add(startNodeId);
  parents.set(startNodeId, null);
  steps.push({ explanation: `Starting BFS from ${startNodeId}. Added to queue.`, visited: new Set(visited), queue: [...queue], parents: new Map(parents) });

  let pathFoundToTarget = false;
  while (queue.length > 0) {
    const u = queue.shift()!;
    steps.push({ explanation: `Dequeued ${u}. Exploring neighbors.`, visited: new Set(visited), queue: [...queue], currentNode: u, processingNeighborsOf: u, parents: new Map(parents) });

    if (endNodeId && u === endNodeId) {
        pathFoundToTarget = true;
        steps.push({ explanation: `Target ${endNodeId} reached!`, visited: new Set(visited), queue: [...queue], currentNode: u, searchComplete: false, parents: new Map(parents), finalPath: reconstructPath(parents, startNodeId, endNodeId) });
        break;
    }

    const neighbors = adj.get(u) || [];
    for (const { neighbor: v } of neighbors) {
      steps.push({ explanation: `Checking edge ${u}-${v}. Is ${v} visited?`, visited: new Set(visited), queue: [...queue], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
      if (!visited.has(v)) {
        visited.add(v);
        parents.set(v, u);
        queue.push(v);
        steps.push({ explanation: `${v} is unvisited. Added to queue. Marked visited.`, visited: new Set(visited), queue: [...queue], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
      } else {
         steps.push({ explanation: `${v} already visited. Skipping.`, visited: new Set(visited), queue: [...queue], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
      }
    }
     steps.push({ explanation: `Finished processing neighbors of ${u}.`, visited: new Set(visited), queue: [...queue], currentNode: u, processingNeighborsOf: undefined, parents: new Map(parents) });
    if (pathFoundToTarget) break;
  }

  const finalMessage = pathFoundToTarget && endNodeId ? `Path found to ${endNodeId}.` : endNodeId ? `Target ${endNodeId} not reachable from ${startNodeId}.` : "BFS complete.";
  steps.push({ explanation: finalMessage, visited: new Set(visited), queue: [...queue], searchComplete: true, message: finalMessage, parents: new Map(parents), finalPath: (endNodeId && pathFoundToTarget) ? reconstructPath(parents, startNodeId, endNodeId) : undefined });
  return steps;
}

function dfsSteps(graph: GraphData, startNodeId: string, endNodeId?: string): GraphSearchStep[] {
    const steps: GraphSearchStep[] = [];
    const adj = buildAdjacencyList(graph);
    const stack: string[] = [];
    const visited = new Set<string>();
    const parents = new Map<string, string | null>();

    if (!graph.nodes.find(n => n.id === startNodeId)) {
        steps.push({ explanation: `Start node ${startNodeId} not found.`, visited, searchComplete: true, message: "Start node invalid." });
        return steps;
    }

    stack.push(startNodeId);
    // For DFS, marking visited when pushed can prevent cycles in some interpretations.
    // Marking visited when popped is also common. Let's mark when pushed for this visualizer.
    // visited.add(startNodeId); 
    parents.set(startNodeId, null);
    steps.push({ explanation: `Starting DFS from ${startNodeId}. Added to stack.`, visited: new Set(visited), stack: [...stack], parents: new Map(parents) });
    
    let pathFoundToTarget = false;
    while (stack.length > 0) {
        const u = stack.pop()!;

        if (visited.has(u)) { // If already visited (e.g. explored all its children from a previous path)
            steps.push({ explanation: `${u} already fully explored. Skipping.`, visited: new Set(visited), stack: [...stack], currentNode: u, parents: new Map(parents) });
            continue;
        }
        
        visited.add(u); // Mark visited when popped and processed
        steps.push({ explanation: `Popped ${u}. Exploring neighbors.`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: u, parents: new Map(parents) });

        if (endNodeId && u === endNodeId) {
            pathFoundToTarget = true;
            steps.push({ explanation: `Target ${endNodeId} reached!`, visited: new Set(visited), stack: [...stack], currentNode: u, searchComplete: false, parents: new Map(parents), finalPath: reconstructPath(parents, startNodeId, endNodeId) });
            break;
        }

        const neighbors = adj.get(u) || [];
        // Add neighbors in reverse order to explore in typical "left-most" or "first-defined" order due to stack LIFO
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const { neighbor: v } = neighbors[i];
            steps.push({ explanation: `Checking edge ${u}-${v}. Is ${v} visited?`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
            if (!visited.has(v)) { // Only push if not already fully explored. Stack might contain it if it's on path from another branch.
                // Check if v is already in stack to avoid re-adding if paths cross, or rely on visited check when popped
                if (!stack.includes(v)) { // Simple check to avoid direct re-pushing if already scheduled from another parent
                     parents.set(v, u); // Parent set when scheduled for visit
                     stack.push(v);
                     steps.push({ explanation: `${v} is unvisited. Added to stack.`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
                } else {
                     steps.push({ explanation: `${v} already in stack (on current path). Skipping re-add.`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
                }
            } else {
                steps.push({ explanation: `${v} already visited. Skipping.`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: u, highlightedEdge: { source: u, target: v }, parents: new Map(parents) });
            }
        }
        steps.push({ explanation: `Finished processing neighbors of ${u}.`, visited: new Set(visited), stack: [...stack], currentNode: u, processingNeighborsOf: undefined, parents: new Map(parents) });
        if (pathFoundToTarget) break;
    }
    
    const finalMessage = pathFoundToTarget && endNodeId ? `Path found to ${endNodeId}.` : endNodeId ? `Target ${endNodeId} not reachable from ${startNodeId}.` : "DFS complete.";
    steps.push({ explanation: finalMessage, visited: new Set(visited), stack: [...stack], searchComplete: true, message: finalMessage, parents: new Map(parents), finalPath: (endNodeId && pathFoundToTarget) ? reconstructPath(parents, startNodeId, endNodeId) : undefined });
    return steps;
}

function dijkstraSteps(graph: GraphData, startNodeId: string, endNodeId: string): GraphSearchStep[] {
    const steps: GraphSearchStep[] = [];
    const adj = buildAdjacencyList(graph);
    
    const distances = new Map<string, number>();
    const parents = new Map<string, string | null>();
    const pq: {node: string, distance: number}[] = []; // Priority queue: {node, distance}
    const finalized = new Set<string>(); // Nodes whose shortest path is found

    graph.nodes.forEach(node => {
        distances.set(node.id, Infinity);
        parents.set(node.id, null);
    });

    if (!graph.nodes.find(n => n.id === startNodeId) || !graph.nodes.find(n => n.id === endNodeId)) {
        steps.push({ explanation: `Start or end node not found.`, visited: finalized, searchComplete: true, message: "Invalid start/end node."});
        return steps;
    }

    distances.set(startNodeId, 0);
    pq.push({node: startNodeId, distance: 0});
    steps.push({ explanation: `Starting Dijkstra's from ${startNodeId}. Target: ${endNodeId}. Initializing distances.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});

    let pathFoundToTarget = false;
    while (pq.length > 0) {
        pq.sort((a, b) => a.distance - b.distance); // Simulate PQ by sorting
        const { node: u, distance: u_dist } = pq.shift()!;

        if (finalized.has(u)) { // If already finalized, skip
             steps.push({ explanation: `Node ${u} already finalized. Skipping.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});
            continue;
        }
        
        finalized.add(u);
        steps.push({ explanation: `Visiting node ${u} (finalized distance: ${u_dist}).`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, processingNeighborsOf: u, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});


        if (u === endNodeId) {
            pathFoundToTarget = true;
            steps.push({ explanation: `Target ${endNodeId} reached with distance ${u_dist}!`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, searchComplete: false, finalPath: reconstructPath(parents, startNodeId, endNodeId), priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance) });
            break;
        }

        const neighbors = adj.get(u) || [];
        for (const { neighbor: v, weight: w } of neighbors) {
            if (finalized.has(v)) continue; // Skip if neighbor already finalized

            steps.push({ explanation: `Checking edge ${u}-${v} (weight ${w}). Current dist to ${v}: ${distances.get(v)}.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, processingNeighborsOf: u, highlightedEdge: {source: u, target: v}, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});

            const altDistance = u_dist + w;
            if (altDistance < (distances.get(v) ?? Infinity)) {
                distances.set(v, altDistance);
                parents.set(v, u);
                
                // Update PQ: remove old entry for v if exists, add new one
                const pqIndex = pq.findIndex(item => item.node === v);
                if (pqIndex > -1) pq.splice(pqIndex, 1);
                pq.push({node: v, distance: altDistance});
                
                steps.push({ explanation: `Relaxed edge ${u}-${v}. New shortest distance to ${v} is ${altDistance}. Updated PQ.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, processingNeighborsOf: u, highlightedEdge: {source: u, target: v}, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});
            } else {
                 steps.push({ explanation: `Edge ${u}-${v} not relaxed. Distance ${altDistance} is not better than ${distances.get(v)}.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, processingNeighborsOf: u, highlightedEdge: {source: u, target: v}, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});
            }
        }
        steps.push({ explanation: `Finished processing neighbors of ${u}.`, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), currentNode: u, processingNeighborsOf: undefined, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});
        if (pathFoundToTarget) break;
    }

    const finalMessage = pathFoundToTarget ? `Shortest path to ${endNodeId} found.` : `Target ${endNodeId} not reachable from ${startNodeId}.`;
    steps.push({ explanation: finalMessage, visited: new Set(finalized), distances: new Map(distances), parents: new Map(parents), searchComplete: true, message: finalMessage, finalPath: pathFoundToTarget ? reconstructPath(parents, startNodeId, endNodeId) : undefined, priorityQueueSnapshot: [...pq].sort((a,b)=>a.distance-b.distance)});
    return steps;
}


export default function GraphSearchVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<GraphAlgorithmType>('bfs');
  const [graphData, setGraphData] = useState<GraphData>(sampleGraph);
  const [startNode, setStartNode] = useState<string>(sampleGraph.nodes[0]?.id || '');
  const [endNode, setEndNode] = useState<string>(sampleGraph.nodes[sampleGraph.nodes.length - 1]?.id || '');

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [searchSteps, setSearchSteps] = useState<GraphSearchStep[]>([]);

  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const algorithmDetails = GRAPH_ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const generateAndSetSteps = useCallback(() => {
    let steps: GraphSearchStep[];
    switch (selectedAlgorithm) {
      case 'bfs':
        steps = bfsSteps(graphData, startNode, endNode);
        break;
      case 'dfs':
        steps = dfsSteps(graphData, startNode, endNode);
        break;
      case 'dijkstra':
        steps = dijkstraSteps(graphData, startNode, endNode);
        break;
      default:
        steps = [{ explanation: "Select an algorithm.", visited: new Set(), searchComplete: true, message: "Algorithm needed." }];
    }
    setSearchSteps(steps);
    setCurrentStepIndex(0);
  }, [selectedAlgorithm, graphData, startNode, endNode]);


  useEffect(() => {
    generateAndSetSteps();
  }, [generateAndSetSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < searchSteps.length - 1) {
      const delay = BASE_ANIMATION_DELAY_MS_GRAPH / speed;
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (isPlaying && currentStepIndex >= searchSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [isPlaying, currentStepIndex, searchSteps.length, speed]);


  const handlePlay = () => {
    if (currentStepIndex >= searchSteps.length - 1 && searchSteps.length > 0) {
      generateAndSetSteps();
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (currentStepIndex < searchSteps.length - 1) setCurrentStepIndex(prev => prev + 1);
    setIsPlaying(false);
  };
  const handleReset = () => {
    setIsPlaying(false);
    generateAndSetSteps();
  };

  const currentDisplayStep = searchSteps[currentStepIndex] || { explanation: "Initializing...", visited: new Set(), queue: [], stack: [], distances: new Map(), parents: new Map() };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <GitFork className="w-7 h-7 text-primary"/> Graph Traversal Visualizer
        </CardTitle>
        <CardDescription>Explore BFS, DFS, and Dijkstra's algorithm on a sample graph.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="graph-algo-select" className="text-sm font-medium">Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={(val) => setSelectedAlgorithm(val as GraphAlgorithmType)} disabled={isPlaying}>
              <SelectTrigger id="graph-algo-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRAPH_ALGORITHMS.map(algo => <SelectItem key={algo.value} value={algo.value}>{algo.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="start-node-select" className="text-sm font-medium">Start Node</Label>
            <Select value={startNode} onValueChange={setStartNode} disabled={isPlaying}>
                <SelectTrigger id="start-node-select"><SelectValue/></SelectTrigger>
                <SelectContent>{graphData.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label || n.id}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs') && (
            <div>
                <Label htmlFor="end-node-select" className="text-sm font-medium">End Node (Optional for BFS/DFS)</Label>
                <Select value={endNode} onValueChange={setEndNode} disabled={isPlaying}>
                    <SelectTrigger id="end-node-select"><SelectValue/></SelectTrigger>
                    <SelectContent>{graphData.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label || n.id}</SelectItem>)}</SelectContent>
                </Select>
            </div>
          )}
        </div>

        <ArenaCanvas className="min-h-[350px] md:min-h-[400px] relative !bg-background">
            <svg width="100%" height="100%" viewBox="0 0 400 200">
                {graphData.edges.map((edge) => {
                    const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                    const targetNode = graphData.nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isHighlighted = currentDisplayStep.highlightedEdge?.source === edge.source && currentDisplayStep.highlightedEdge?.target === edge.target ||
                                        currentDisplayStep.highlightedEdge?.source === edge.target && currentDisplayStep.highlightedEdge?.target === edge.source;
                    const isInPath = currentDisplayStep.finalPath?.includes(edge.source) && currentDisplayStep.finalPath?.includes(edge.target) &&
                                     Math.abs(currentDisplayStep.finalPath.indexOf(edge.source) - currentDisplayStep.finalPath.indexOf(edge.target)) === 1;

                    return (
                        <g key={edge.id}>
                             <line
                                x1={sourceNode.x} y1={sourceNode.y}
                                x2={targetNode.x} y2={targetNode.y}
                                stroke={isInPath ? "hsl(var(--destructive))" : isHighlighted ? "hsl(var(--chart-4))" : "hsl(var(--muted-foreground)/0.5)"}
                                strokeWidth={isInPath ? "3" : isHighlighted ? "2.5" : "1.5"}
                                className="transition-all duration-150"
                            />
                            {edge.weight && selectedAlgorithm === 'dijkstra' && (
                                <text
                                x={(sourceNode.x + targetNode.x) / 2 + 3}
                                y={(sourceNode.y + targetNode.y) / 2 - 3}
                                fontSize="8" fill="hsl(var(--foreground))" textAnchor="middle"
                                >
                                {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}
                {graphData.nodes.map(node => {
                    const isCurrent = currentDisplayStep.currentNode === node.id;
                    const isProcessingNeighbor = currentDisplayStep.processingNeighborsOf === node.id;
                    const isVisited = currentDisplayStep.visited.has(node.id);
                    const isInQueue = currentDisplayStep.queue?.includes(node.id);
                    const isInStack = currentDisplayStep.stack?.includes(node.id);
                    const isInPath = currentDisplayStep.finalPath?.includes(node.id);

                    let fillClass = "fill-muted-foreground/30";
                    if (isInPath) fillClass = "fill-destructive/80";
                    else if (isCurrent) fillClass = "fill-yellow-400/80";
                    else if (isProcessingNeighbor) fillClass = "fill-yellow-500/90";
                    else if (isInQueue || isInStack) fillClass = "fill-blue-400/70";
                    else if (isVisited) fillClass = "fill-primary/60";

                    return (
                        <g key={node.id} className="transition-all duration-150">
                            <circle
                                cx={node.x} cy={node.y} r="12"
                                className={cn(fillClass, "stroke-foreground/70")}
                                strokeWidth={isCurrent || isProcessingNeighbor || isInPath ? "2" : "1"}
                            />
                            <text x={node.x} y={node.y} dy="3.5" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-background pointer-events-none">
                                {node.label || node.id}
                            </text>
                             {selectedAlgorithm === 'dijkstra' && currentDisplayStep.distances?.has(node.id) && (
                                <text x={node.x} y={node.y - 15} fontSize="7" textAnchor="middle" className="fill-primary">
                                    {currentDisplayStep.distances.get(node.id) === Infinity ? '∞' : currentDisplayStep.distances.get(node.id)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </ArenaCanvas>

        <ArenaControls
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            isPlaying={isPlaying}
            speedValue={speed}
            onSpeedChange={setSpeed}
            canPlay={!isPlaying && (searchSteps.length > 0 && (currentStepIndex < searchSteps.length -1 || searchSteps.length === 0))}
            canPause={isPlaying}
            canStep={!isPlaying && (searchSteps.length > 0 && currentStepIndex < searchSteps.length -1)}
            onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={`${algorithmDetails?.label || "Algorithm"} Explanation`}
          currentStepExplanation={
             <>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                 <p className="font-semibold">How it works:</p>
                <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm.'}</p>
                {algorithmDetails && (
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <ComplexityDisplay complexity={algorithmDetails.timeComplexity} type="Time" />
                    <ComplexityDisplay complexity={algorithmDetails.spaceComplexity} type="Space" />
                  </div>
                )}
              </div>
              {currentDisplayStep.message && currentDisplayStep.searchComplete && (
                 <p className="mt-2 pt-2 border-t text-accent-foreground/80 text-sm font-semibold">
                    {currentDisplayStep.message}
                </p>
              )}
              {currentDisplayStep.explanation && (
                <p className="mt-2 pt-2 border-t text-accent-foreground/80 text-xs">Current Action: {currentDisplayStep.explanation}</p>
              )}
               {(selectedAlgorithm === "bfs" && currentDisplayStep.queue) && (
                <p className="mt-1 text-xs text-blue-600">Queue: [{currentDisplayStep.queue.join(', ')}]</p>
              )}
              {(selectedAlgorithm === "dfs" && currentDisplayStep.stack) && (
                <p className="mt-1 text-xs text-indigo-600">Stack: [{currentDisplayStep.stack.join(', ')}]</p>
              )}
              {(selectedAlgorithm === "dijkstra" && currentDisplayStep.priorityQueueSnapshot) && (
                <p className="mt-1 text-xs text-purple-600">
                    PQ: [{currentDisplayStep.priorityQueueSnapshot.map(item => `${item.node}(${item.distance === Infinity ? '∞' : item.distance})`).join(', ')}]
                </p>
              )}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
