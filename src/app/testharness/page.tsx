// src/app/testharness/page.tsx
import EquationTestHarness from '@/components/debug/EquationTestHarness';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Test Harness | Graphify | Plenty of π',
  description: 'Test edge-case equations for the Graphify calculator.',
};

export default function TestHarnessPage() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">This page is only available in development mode.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/graphify">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Graphify
        </Link>
      </Button>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Graphify Test Harness</h1>
        <p className="text-muted-foreground">
          Use this page to test edge-case equations and graphing behavior.
        </p>
      </header>
      <EquationTestHarness />
    </div>
  );
}
