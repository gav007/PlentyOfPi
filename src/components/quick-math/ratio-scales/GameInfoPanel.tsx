
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Target, History, Smile, Frown, CheckCircleIcon } from 'lucide-react';
import type { Ratio, GameStatus } from './RatioScalesCard';

interface GameInfoPanelProps {
  targetRatio: Ratio;
  attemptsLeft: number;
  gameStatus: GameStatus;
}

export default function GameInfoPanel({ targetRatio, attemptsLeft, gameStatus }: GameInfoPanelProps) {
  let statusIcon;
  let statusTextClass = "text-primary";

  switch (gameStatus) {
    case 'balanced':
      statusIcon = <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      statusTextClass = "text-green-500";
      break;
    case 'gameOver':
      statusIcon = <Frown className="w-5 h-5 text-destructive" />;
      statusTextClass = "text-destructive";
      break;
    case 'playing':
    default:
      statusIcon = <Smile className="w-5 h-5 text-primary" />;
      break;
  }

  return (
    <Card className="bg-muted/30 shadow-sm">
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center items-center">
        <div className="p-2 bg-background/50 rounded-lg shadow-inner">
          <span className="font-semibold text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1">
            <Target className="w-4 h-4 text-primary" /> TARGET RATIO
          </span>
          <span className="font-mono text-xl sm:text-2xl text-primary">
            {targetRatio.left} : {targetRatio.right}
          </span>
        </div>
        <div className="p-2 bg-background/50 rounded-lg shadow-inner">
          <span className="font-semibold text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1">
            <History className="w-4 h-4 text-primary" /> ATTEMPTS LEFT
          </span>
          <span className="font-mono text-xl sm:text-2xl text-primary">
            {attemptsLeft}
          </span>
        </div>
        <div className="p-2 bg-background/50 rounded-lg shadow-inner">
           <span className="font-semibold text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1">
             GAME STATUS
          </span>
          <span className={`font-mono text-lg sm:text-xl flex items-center justify-center gap-1 ${statusTextClass}`}>
            {statusIcon} {gameStatus.toUpperCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
