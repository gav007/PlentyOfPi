
import CalculusPlaygroundCard from '@/components/calculus-playground/CalculusPlaygroundCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculus Playground | Plenty of π',
  description: 'Explore functions, derivatives, and integrals interactively.',
};

export default function CalculusPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Calculus Playground</h1>
        <p className="text-lg text-muted-foreground">
          Visualize functions, their derivatives, and integrals in real-time.
        </p>
      </header>
      <CalculusPlaygroundCard />
    </div>
  );
}
