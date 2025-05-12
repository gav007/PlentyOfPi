
'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface ArenaControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStep?: () => void;
  onReset?: () => void;
  onSpeedChange?: (speed: number) => void;
  onToggleExplanation?: () => void;
  isPlaying?: boolean;
  speedValue?: number; // e.g., 1 to 5
  canStep?: boolean;
  canPlay?: boolean;
  canPause?: boolean;
}

export default function ArenaControls({
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onToggleExplanation,
  isPlaying = false,
  speedValue = 3,
  canStep = true,
  canPlay = true,
  canPause = true,
}: ArenaControlsProps) {
  // This component will provide standard controls like Play, Pause, Step, Reset, Speed.

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-muted rounded-md shadow">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onPlay} disabled={isPlaying || !canPlay} aria-label="Play animation">
                <Play className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Play</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onPause} disabled={!isPlaying || !canPause} aria-label="Pause animation">
                <Pause className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Pause</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onStep} disabled={isPlaying || !canStep} aria-label="Step forward">
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Step Forward</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
               <Button variant="outline" size="icon" onClick={onReset} aria-label="Reset animation">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Reset</p></TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[150px]">
          <FastForward className="h-5 w-5 text-muted-foreground" />
          <Slider
            defaultValue={[speedValue]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => onSpeedChange && onSpeedChange(value[0])}
            aria-label="Animation speed control"
            className="flex-grow"
          />
        </div>
        
        {onToggleExplanation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleExplanation} aria-label="Toggle explanation panel">
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
             <TooltipContent><p>Toggle Explanation</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
