
'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderControlProps {
  value: number; // This is the value from the parent (CalculusPlaygroundCard's xValue)
  onValueChange: (newValue: number) => void; // Callback to update parent's xValue
  min: number;
  max: number;
  step: number;
}

export default function SliderControl({ value: parentValue, onValueChange, min, max, step }: SliderControlProps) {
  const [internalValue, setInternalValue] = React.useState(parentValue);

  // Effect to synchronize internalValue when parentValue changes (e.g., from graph click)
  React.useEffect(() => {
    // Only update if the parent value is significantly different from the internal one,
    // or if internalValue hasn't been initialized properly yet.
    if (Math.abs(parentValue - internalValue) > 1e-9) {
      setInternalValue(parentValue);
    }
  }, [parentValue, internalValue]); // Re-run if parentValue changes. internalValue added to avoid stale closures in condition.

  const handleSliderInteraction = (newValues: number[]) => {
    const newValueFromSlider = newValues[0];
    setInternalValue(newValueFromSlider); // Update internal state immediately for responsive UI

    // Only call parent's onValueChange if the slider's new value
    // is meaningfully different from what the parent currently holds (parentValue).
    // This prevents loops if the parentValue update causes a re-render that
    // might inadvertently try to set the same value again.
    if (Math.abs(parentValue - newValueFromSlider) > 1e-9) {
      onValueChange(newValueFromSlider);
    }
  };
  
  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01; 
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {internalValue.toFixed(3)} {/* Display internalValue for immediate visual feedback */}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[internalValue]} // Controlled by internalValue
        onValueChange={handleSliderInteraction} // Use the new handler
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${internalValue.toFixed(3)}`}
        disabled={min >= max || isNaN(min) || isNaN(max)}
      />
    </div>
  );
}
