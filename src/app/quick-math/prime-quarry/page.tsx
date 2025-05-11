
import PrimeQuarryCard from '@/components/quick-math/prime-quarry/PrimeQuarryCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prime Quarry | Quick Math | Plenty of π',
  description: 'Test your prime number knowledge. Chip away at composite numbers to find the primes!',
};

export default function PrimeQuarryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PrimeQuarryCard />
    </div>
  );
}
