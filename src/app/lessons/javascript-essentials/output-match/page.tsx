
import type { Metadata } from 'next';
import OutputMatchGameJs from '@/components/javascript-essentials/output-match-js/OutputMatchGameJs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JavaScript Output Match | Plenty of π',
  description: 'Challenge: Match JavaScript code to its output.',
};

export default function OutputMatchJSPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/lessons/javascript-essentials">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to JavaScript Essentials
        </Link>
      </Button>
      <OutputMatchGameJs />
    </div>
  );
}
