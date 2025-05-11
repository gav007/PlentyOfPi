
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Python Debug It! | Plenty of π',
  description: 'Challenge: Fix broken Python code snippets.',
};

export default function DebugItPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-8">
        Python Debug It! Puzzles
      </h1>
      <p className="text-xl text-muted-foreground mb-12">
        This interactive challenge is coming soon!
      </p>
      <Button asChild>
        <Link href="/lessons/python-foundations">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Python Foundations
        </Link>
      </Button>
    </div>
  );
}
