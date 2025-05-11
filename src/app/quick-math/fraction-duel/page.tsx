
import FractionDuelCard from '@/components/quick-math/fraction-duel/FractionDuelCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fraction Duel | Quick Math | Plenty of π',
  description: 'Test your fraction skills! Solve expressions and choose the correct answer.',
};

export default function FractionDuelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FractionDuelCard />
    </div>
  );
}
