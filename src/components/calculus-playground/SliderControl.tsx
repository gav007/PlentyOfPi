
'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderControlProps {
  value: number; // This is parentValue from CalculusPlaygroundCard's xValue
  onValueChange: (newValue: number) => void; // Callback to update parent's xValue
  min: number;
  max: number;
  step: number;
}

export default function SliderControl({ value: parentValue, onValueChange, min, max, step }: SliderControlProps) {
  
  const handleSliderValueChange = (newValues: number[]) => {
    const newValueFromSlider = newValues[0];
    // Directly call the parent's onValueChange.
    // The parent (CalculusPlaygroundCard) will update its state (xValue),
    // which will then flow back down as the `parentValue` prop to this component.
    if (Math.abs(parentValue - newValueFromSlider) > 1e-9) { // Still good to prevent tiny float diffs
      onValueChange(newValueFromSlider);
    }
  };
  
  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01; 
  
  // Ensure parentValue is always within min/max bounds for the Slider component
  // as Radix slider can throw errors if value is out of bounds.
  // Also handle NaN for min/max/parentValue defensively.
  const isBoundsValid = !isNaN(min) && !isNaN(max) && min < max;
  const safeParentValue = isNaN(parentValue) ? (isBoundsValid ? min : 0) : parentValue;
  const clampedParentValue = isBoundsValid ? Math.max(min, Math.min(max, safeParentValue)) : (isBoundsValid ? min : 0) ;

  if (!isBoundsValid) {
     // Render a disabled state or nothing if bounds are invalid
     return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label htmlFor="x-slider" className="text-base font-semibold">
                Adjust x-value (or click on graph):
                </Label>
                <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
                N/A
                </span>
            </div>
            <Slider
                id="x-slider"
                value={[0]} // Some default valid value
                min={0}     // Default min
                max={1}     // Default max
                step={0.01} // Default step
                aria-label={`x-value slider, current value N/A (invalid bounds)`}
                disabled={true}
            />
        </div>
     );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {parentValue.toFixed(3)}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[clampedParentValue]} // Directly use (clamped) parentValue
        onValueChange={handleSliderValueChange}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${parentValue.toFixed(3)}`}
        disabled={!isBoundsValid} // Disable if bounds are invalid
      />
    </div>
  );
}

