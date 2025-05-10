
import { cn } from '@/lib/utils';

interface BitOutputPanelProps {
  decimal: number;
  hex: string;
  binary: string;
  gameMode: boolean;
  targetDecimal: number | null;
  score: number; // Total score
  timeLeft: number;
  turn: number | null;
  maxTurns: number;
  isGameOver: boolean;
}

export default function BitOutputPanel({
  decimal,
  hex,
  binary,
  gameMode,
  targetDecimal,
  score,
  timeLeft,
  turn,
  maxTurns,
  isGameOver,
}: BitOutputPanelProps) {
  return (
    <div
      className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 mb-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="p-3 bg-muted/30 rounded-lg shadow">
        <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">DECIMAL</span>
        <span className="font-mono text-lg sm:text-xl text-foreground" aria-label={`Decimal value: ${decimal}`}>
          {decimal}
        </span>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg shadow">
        <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">HEX</span>
        <span className="font-mono text-lg sm:text-xl text-foreground uppercase" aria-label={`Hexadecimal value: ${hex}`}>
          {hex}
        </span>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg shadow col-span-1 min-[400px]:col-span-2 md:col-span-1">
        <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">BINARY</span>
        <span className="font-mono text-base sm:text-lg text-foreground break-all" aria-label={`Binary value: ${binary}`}>
          {binary}
        </span>
      </div>

      {gameMode && (
        <>
          <div className="p-3 bg-accent/20 rounded-lg shadow">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">🎯 TARGET</span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {targetDecimal ?? '-'}
            </span>
          </div>
          <div className="p-3 bg-accent/20 rounded-lg shadow">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">🏆 SCORE</span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {score}
            </span>
          </div>
          <div className="p-3 bg-accent/20 rounded-lg shadow">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">⏱️ TIME</span>
            <span
              className={cn(
                'font-mono text-lg sm:text-xl',
                timeLeft <= 10 && timeLeft > 0 && !isGameOver ? 'text-destructive animate-pulse' : 'text-primary'
              )}
            >
              {timeLeft > 0 || isGameOver ? `${timeLeft}s` : "N/A"} 
              {/* Show N/A or final time if game over? For now, just timeLeft */}
            </span>
          </div>
           <div className="p-3 bg-accent/20 rounded-lg shadow md:col-start-2">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm">🔄 TURN</span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {isGameOver ? `Over` : turn ? `${turn}/${maxTurns}` : '-'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
