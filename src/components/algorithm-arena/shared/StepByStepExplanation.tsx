
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface StepByStepExplanationProps {
  title?: string;
  currentStepExplanation: string | React.ReactNode | null;
  isOpen?: boolean; // Controlled by parent via onToggleExplanation in ArenaControls
}

export default function StepByStepExplanation({
  title = "Explanation",
  currentStepExplanation,
  isOpen = false,
}: StepByStepExplanationProps) {
  if (!isOpen || !currentStepExplanation) {
    return null;
  }

  return (
    <Card className="mt-4 bg-accent/10 border-accent/50 shadow-md">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-md font-semibold text-accent-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-accent-foreground/90 prose prose-sm dark:prose-invert max-w-none leading-relaxed py-3">
        {typeof currentStepExplanation === 'string' ? <p>{currentStepExplanation}</p> : currentStepExplanation}
      </CardContent>
    </Card>
  );
}
