
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calculator as CalculatorIcon } from 'lucide-react'; // Renamed to avoid conflict

export const metadata: Metadata = {
  title: 'Graphing Calculator | Plenty of π',
  description: 'Powerful graphing calculator to plot functions and visualize math. (Coming Soon)',
};

export default function GraphingCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
      <CalculatorIcon className="w-16 h-16 mx-auto text-primary mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-8">
        Graphing Calculator
      </h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        Get ready to explore the world of functions like never before! Our advanced graphing calculator is under construction and will be launching soon.
      </p>
      <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
        It will feature a wide range of capabilities, allowing you to plot complex equations, analyze graphs, find intersections, and much more, all with an intuitive interface.
      </p>
      <Button asChild size="lg">
        <Link href="/">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
