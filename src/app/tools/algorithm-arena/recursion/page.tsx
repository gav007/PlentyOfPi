
import RecursionVisualizer from '@/components/algorithm-arena/visualizers/RecursionVisualizer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recursion Visualizer | Algorithm Arena | Plenty of π',
  description: 'Understand recursive concepts like Factorial, Fibonacci, and Tower of Hanoi.',
};

export default function RecursionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Recursion Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          See how recursive functions solve problems by breaking them down. Visualize the call stack in action.
        </p>
      </header>
      <RecursionVisualizer />
    </div>
  );
}
