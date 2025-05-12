
import SearchVisualizer from '@/components/algorithm-arena/visualizers/SearchVisualizer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Searching Algorithm Visualizer | Algorithm Arena | Plenty of π',
  description: 'Visualize searching algorithms like Linear Search and Binary Search step-by-step.',
};

export default function SearchingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Searching Algorithm Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          See how Linear Search and Binary Search find elements.
        </p>
      </header>
      <SearchVisualizer />
    </div>
  );
}
