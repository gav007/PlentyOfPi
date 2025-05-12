
import GraphPlotterCard from '@/components/math-tools/graph-plotter/GraphPlotterCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graph Plotter | Plenty of π',
  description: 'Plot mathematical functions and explore their graphs. (Coming Soon)',
};

export default function GraphPlotterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GraphPlotterCard />
    </div>
  );
}
