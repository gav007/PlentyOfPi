
'use client';

import * as React from 'react';
import { Slider as ShadSlider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderControlProps {
  value: number;
  onValueChange: (newValue: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function SliderControl({ value, onValueChange, min, max, step }: SliderControlProps) {
  // Direct passthrough of value to ShadSlider, parent (CalculusPlaygroundCard) handles clamping if needed
  // The bug was often related to feedback loops between internal state here and parent state.
  // Simplification: this component is now more "controlled" by its parent.

  const handleSliderValueChange = React.useCallback((newValues: number[]) => {
    onValueChange(newValues[0]);
  }, [onValueChange]);

  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01;
  const isBoundsValid = !isNaN(min) && !isNaN(max) && min < max;
  const displayValueInLabel = isNaN(value) ? "N/A" : value.toFixed(3);
  
  // Use the parent's 'value' directly, clamped if necessary for display but ShadCN slider handles its own internal clamping.
  // Ensure value is always an array for ShadSlider
  const sliderDrivenValue = isBoundsValid ? [Math.max(min, Math.min(max, value))] : [0];


  if (!isBoundsValid) {
     return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label htmlFor="x-slider-calculus-disabled" className="text-base font-semibold">
                Adjust x-value (or click on graph):
                </Label>
                <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
                N/A
                </span>
            </div>
            <ShadSlider
                id="x-slider-calculus-disabled"
                value={[0]} 
                min={0}
                max={1}
                step={0.01}
                aria-label={`x-value slider, current value N/A (invalid bounds)`}
                disabled={true}
            />
        </div>
     );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider-calculus" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {displayValueInLabel}
        </span>
      </div>
      <ShadSlider
        id="x-slider-calculus"
        value={sliderDrivenValue}
        onValueChange={handleSliderValueChange}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${displayValueInLabel}`}
        disabled={!isBoundsValid}
      />
    </div>
  );
}
