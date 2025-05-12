
import type { Metadata } from 'next';
import DebugItGameJs from '@/components/javascript-essentials/debug-it-js/DebugItGameJs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JavaScript Debug It! | Plenty of π',
  description: 'Challenge: Fix broken JavaScript code snippets.',
};

export default function DebugItJSPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/lessons/javascript-essentials">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to JavaScript Essentials
        </Link>
      </Button>
      <DebugItGameJs />
    </div>
  );
}
