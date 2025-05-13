
import GraphifyLayout from '@/components/graphify/GraphifyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graphify Calculator | Plenty of π',
  description: 'Interactive graphing calculator. Plot multiple functions, explore graphs, and visualize equations in real-time.',
};

export default function GraphifyPage() {
  return (
    <div className="container mx-auto min-h-screen">
      <GraphifyLayout />
    </div>
  );
}
