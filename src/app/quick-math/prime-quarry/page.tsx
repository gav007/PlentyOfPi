
import PrimeQuarryCard from '@/components/quick-math/prime-quarry/PrimeQuarryCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prime Factorization Tree | Quick Math | Plenty of π',
  description: 'Visualize the prime factorization of numbers as an interactive tree. Enter a number to see how it breaks down into its prime components.',
};

export default function PrimeQuarryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PrimeQuarryCard />
    </div>
  );
}
