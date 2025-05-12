
'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, SlidersHorizontal, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FourierControlsProps {
  numTerms: number;
  onNumTermsChange: (value: number) => void;
  maxTerms: number;
  isPlaying: boolean;
  onPlayPauseChange: (playing: boolean) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

export default function FourierControls({
  numTerms,
  onNumTermsChange,
  maxTerms,
  isPlaying,
  onPlayPauseChange,
  animationSpeed,
  onAnimationSpeedChange,
}: FourierControlsProps) {
  
  const handleNumTermsSliderChange = (value: number[]) => {
    onNumTermsChange(value[0]);
  };

  const handleSpeedSliderChange = (value: number[]) => {
    // Map slider value (1-100) to a speed range (e.g., 0.001 to 0.1)
    onAnimationSpeedChange(value[0] / 1000); 
  };

  const incrementTerms = () => onNumTermsChange(Math.min(numTerms + 1, maxTerms));
  const decrementTerms = () => onNumTermsChange(Math.max(1, numTerms - 1));

  return (
    <Card className="p-4 bg-muted/30 shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Number of Terms Control */}
        <div className="space-y-2">
          <Label htmlFor="num-terms-slider" className="flex items-center justify-between text-sm">
            Number of Terms (N): <span className="font-bold text-primary">{numTerms}</span>
          </Label>
           <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={decrementTerms} disabled={numTerms <= 1} aria-label="Decrease number of terms">
              <Minus className="w-4 h-4" />
            </Button>
            <Slider
                id="num-terms-slider"
                min={1}
                max={maxTerms}
                step={1}
                value={[numTerms]}
                onValueChange={handleNumTermsSliderChange}
                className="flex-grow"
            />
            <Button variant="outline" size="icon" onClick={incrementTerms} disabled={numTerms >= maxTerms} aria-label="Increase number of terms">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Animation Speed Control */}
        <div className="space-y-2">
          <Label htmlFor="speed-slider" className="text-sm">Animation Speed</Label>
          <Slider
            id="speed-slider"
            min={1} // Represents 0.001
            max={100} // Represents 0.1
            step={1}
            value={[animationSpeed * 1000]}
            onValueChange={handleSpeedSliderChange}
          />
        </div>

        {/* Play/Pause Control */}
        <div className="flex justify-center md:justify-end items-center">
          <Button onClick={() => onPlayPauseChange(!isPlaying)} variant="outline" size="lg" className="w-full md:w-auto">
            {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
