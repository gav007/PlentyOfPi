
import type { Metadata } from 'next';
import DebugItGame from '@/components/python-foundations/debug-it/DebugItGame';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Python Debug It! | Plenty of π',
  description: 'Challenge: Fix broken Python code snippets.',
};

export default function DebugItPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/lessons/python-foundations">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Python Foundations
        </Link>
      </Button>
      <DebugItGame />
    </div>
  );
}
