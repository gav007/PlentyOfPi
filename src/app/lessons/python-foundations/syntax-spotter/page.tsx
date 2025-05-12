
import type { Metadata } from 'next';
import SyntaxSpotterGame from '@/components/python-foundations/syntax-spotter/SyntaxSpotterGame';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Python Syntax Spotter | Plenty of π',
  description: 'Challenge: Find syntax errors in Python code.',
};

export default function SyntaxSpotterPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
       <Button asChild variant="outline" className="mb-8">
        <Link href="/lessons/python-foundations">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Python Foundations
        </Link>
      </Button>
      <SyntaxSpotterGame />
    </div>
  );
}
