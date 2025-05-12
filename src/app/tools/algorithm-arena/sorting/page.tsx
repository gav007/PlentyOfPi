
import SortVisualizer from '@/components/algorithm-arena/visualizers/SortVisualizer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sorting Algorithm Visualizer | Algorithm Arena | Plenty of π',
  description: 'Visualize sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort step-by-step.',
};

export default function SortingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Sorting Algorithm Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          Watch various sorting algorithms in action.
        </p>
      </header>
      <SortVisualizer />
    </div>
  );
}
