
import GraphSearchVisualizer from '@/components/algorithm-arena/visualizers/GraphSearchVisualizer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graph Traversal Visualizer | Algorithm Arena | Plenty of π',
  description: 'Explore graph structures with BFS, DFS, and pathfinding algorithms.',
};

export default function GraphTraversalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Graph Traversal Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          Understand how graph algorithms navigate through nodes and edges.
        </p>
      </header>
      <GraphSearchVisualizer />
    </div>
  );
}
