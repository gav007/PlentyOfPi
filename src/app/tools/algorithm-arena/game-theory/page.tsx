
import PrisonersDilemma from '@/components/algorithm-arena/game-theory/PrisonersDilemma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Theory Playground | Algorithm Arena | Plenty of π',
  description: 'Simulate classic game theory scenarios like the Prisoner\'s Dilemma and test strategies.',
};

export default function GameTheoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Game Theory Playground</h1>
        <p className="text-lg text-muted-foreground">
          Explore strategic decision-making in various game scenarios.
        </p>
      </header>
      <PrisonersDilemma /> 
      {/* Other games can be added here or linked from a sub-dashboard */}
    </div>
  );
}
