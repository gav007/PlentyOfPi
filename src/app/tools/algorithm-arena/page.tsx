
import AlgorithmArenaDashboard from '@/components/algorithm-arena/AlgorithmArenaDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algorithm Arena | Plenty of π',
  description: 'Explore and visualize various algorithms and game theory concepts interactively.',
};

export default function AlgorithmArenaPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <AlgorithmArenaDashboard />
    </div>
  );
}
