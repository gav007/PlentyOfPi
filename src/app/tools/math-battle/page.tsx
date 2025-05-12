
import MathBattleGame from '@/components/math-tools/math-battle/MathBattleGame';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Math Battle | Plenty of π',
  description: 'Test your mental math skills in a timed challenge!',
};

export default function MathBattlePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MathBattleGame />
    </div>
  );
}
