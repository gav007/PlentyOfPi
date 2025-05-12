
import PrimeTesterCard from '@/components/math-tools/prime-tester/PrimeTesterCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prime Number Tester | Plenty of π',
  description: 'Test numbers for primality, find factors, and see next prime numbers.',
};

export default function PrimeTesterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PrimeTesterCard />
    </div>
  );
}
