
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  sumLeft: number;
  sumRight: number;
  simplifiedLeft: number;
  simplifiedRight: number;
  isBalanced: boolean;
}

export default function ResultDisplay({
  sumLeft,
  sumRight,
  simplifiedLeft,
  simplifiedRight,
  isBalanced,
}: ResultDisplayProps) {
  return (
    <Card className={cn(
        "mt-6 text-center border-2",
        isBalanced ? "border-green-500 bg-green-500/10" : "border-border bg-card"
    )}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className={cn(
            "text-xl flex items-center justify-center gap-2",
            isBalanced ? "text-green-600" : "text-foreground"
        )}>
          {isBalanced ? <CheckCircle className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6"/>}
          Scale Status: {isBalanced ? "Balanced!" : "Unbalanced"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
                <p className="text-sm text-muted-foreground">Current Weights</p>
                <p className="text-3xl font-bold">
                    <span className={cn(sumLeft > sumRight ? "text-primary" : "text-foreground")}>{sumLeft}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className={cn(sumRight > sumLeft ? "text-primary" : "text-foreground")}>{sumRight}</span>
                </p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Simplified Ratio</p>
                <p className="text-3xl font-bold">
                    <span className={cn(simplifiedLeft > simplifiedRight && !isBalanced ? "text-accent-foreground" : "text-foreground")}>{simplifiedLeft}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className={cn(simplifiedRight > simplifiedLeft && !isBalanced ? "text-accent-foreground" : "text-foreground")}>{simplifiedRight}</span>
                </p>
            </div>
        </div>
        {isBalanced && (
            <p className="mt-3 text-green-600 font-medium">The scales are perfectly balanced. The ratio {sumLeft}:{sumRight} simplifies to {simplifiedLeft}:{simplifiedRight}.</p>
        )}
      </CardContent>
    </Card>
  );
}
