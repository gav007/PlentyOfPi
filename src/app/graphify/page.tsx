
import GraphifyLayout from '@/components/graphify/GraphifyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graphify Calculator | Plenty of π',
  description: 'Interactive graphing calculator. Plot multiple functions, explore graphs, and visualize equations in real-time.',
};

export default function GraphifyPage() {
  return (
    // Container removed, GraphifyLayout handles its own padding and flex growth
    <GraphifyLayout />
  );
}
