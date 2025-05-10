'use client';

import { Award, Zap } from 'lucide-react';

interface ScorePanelHexProps {
  score: number;
  streak: number;
}

export default function ScorePanelHex({ score, streak }: ScorePanelHexProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-center my-4">
      <div className="p-3 bg-accent/20 rounded-lg shadow">
        <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
          <Award className="w-4 h-4" /> SCORE
        </span>
        <span className="font-mono text-lg sm:text-xl text-primary">
          {score}
        </span>
      </div>
      <div className="p-3 bg-accent/20 rounded-lg shadow">
        <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
          <Zap className="w-4 h-4" /> STREAK
        </span>
        <span className="font-mono text-lg sm:text-xl text-primary">
          {streak} 🔥
        </span>
      </div>
    </div>
  );
}
