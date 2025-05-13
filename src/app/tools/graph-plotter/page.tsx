
import GraphingCalculator from '@/components/math-tools/graphing-calculator/GraphingCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graph Plotter | Math Tools | Plenty of π',
  description: 'Interactive graph plotter. Visualize multiple functions, pan, zoom, and explore mathematical equations in real-time.',
};

export default function GraphPlotterPage() {
  return (
    // Changed min-h-screen to h-screen for full height layout, and p-0 for GraphingCalculator to control its own padding
    <div className="h-screen w-full flex flex-col p-0 overflow-hidden"> 
      <GraphingCalculator />
    </div>
  );
}
