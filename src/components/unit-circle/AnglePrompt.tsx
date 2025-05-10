
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAngleToPiString } from '@/lib/AngleEvaluation';
import { Target } from 'lucide-react';

interface AnglePromptProps {
  targetAngleRad: number;
}

export default function AnglePrompt({ targetAngleRad }: AnglePromptProps) {
  return (
    <div className="my-4 text-center p-4 border border-dashed border-primary/50 rounded-lg bg-primary/10">
      <p className="text-sm font-medium text-primary-foreground mb-1 flex items-center justify-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        TARGET ANGLE
      </p>
      <p className="text-2xl font-bold text-primary">
        {formatAngleToPiString(targetAngleRad)}
      </p>
    </div>
  );
}
