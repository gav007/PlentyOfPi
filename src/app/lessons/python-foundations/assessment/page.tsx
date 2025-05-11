
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Python Foundations Assessment | Plenty of π',
  description: 'Test your knowledge of Python fundamentals.',
};

export default function AssessmentPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-8">
        Python Foundations Final Assessment
      </h1>
      <p className="text-xl text-muted-foreground mb-6">
        This assessment will test your understanding of the core Python concepts covered in this module.
        It will consist of 10 multiple-choice questions, and a score of 70% or higher is needed to pass.
      </p>
      <p className="text-xl text-muted-foreground mb-12">
        The assessment is currently under development and will be available soon!
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
