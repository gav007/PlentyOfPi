
import type { Metadata } from 'next';
import SyntaxSpotterGameJs from '@/components/javascript-essentials/syntax-spotter-js/SyntaxSpotterGameJs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JavaScript Syntax Spotter | Plenty of π',
  description: 'Challenge: Find syntax errors in JavaScript code.',
};

export default function SyntaxSpotterJSPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
       <Button asChild variant="outline" className="mb-8">
        <Link href="/lessons/javascript-essentials">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to JavaScript Essentials
        </Link>
      </Button>
      <SyntaxSpotterGameJs />
    </div>
  );
}
