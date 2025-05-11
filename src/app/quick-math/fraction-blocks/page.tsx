
import FractionBlocksCard from '@/components/quick-math/fraction-blocks/FractionBlocksCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fraction Blocks | Quick Math | Plenty of π',
  description: 'Combine and simplify fractions visually. Learn about common denominators and fraction arithmetic.',
};

export default function FractionBlocksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FractionBlocksCard />
    </div>
  );
}
