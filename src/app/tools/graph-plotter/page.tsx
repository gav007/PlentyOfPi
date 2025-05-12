
import GraphingCalculator from '@/components/math-tools/graphing-calculator/GraphingCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Graphing Calculator | Plenty of π',
  description: 'Plot mathematical functions, explore graphs, and visualize equations in real-time.',
};

export default function GraphPlotterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GraphingCalculator />
    </div>
  );
}
