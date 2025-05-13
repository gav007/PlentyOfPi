
'use client';

import * as React from 'react';
import { Slider as ShadSlider } from '@/components/ui/slider'; // Aliased import
import { Label } from '@/components/ui/label';

interface SliderControlProps {
  value: number;
  onValueChange: (newValue: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function SliderControl({ value, onValueChange, min, max, step }: SliderControlProps) {
  const [internalSliderValue, setInternalSliderValue] = React.useState(value);

  // Effect to sync internal state when the parent's 'value', 'min', or 'max' prop changes.
  React.useEffect(() => {
    const isBoundsValidForEffect = !isNaN(min) && !isNaN(max) && min < max;
    const safeParentValueForEffect = isNaN(value) ? (isBoundsValidForEffect ? min : 0) : value;
    const clampedParentValueForEffect = isBoundsValidForEffect
      ? Math.max(min, Math.min(max, safeParentValueForEffect))
      : (isBoundsValidForEffect ? min : 0);

    // Only update internal state if the (potentially clamped) parent value
    // is meaningfully different from the current internal state.
    if (Math.abs(clampedParentValueForEffect - internalSliderValue) > 1e-9) {
      setInternalSliderValue(clampedParentValueForEffect);
    }
  }, [value, min, max]); // Removed internalSliderValue from dependencies

  // Callback for when the user interacts with the slider.
  const handleSliderInteraction = React.useCallback((newValues: number[]) => {
    const newValueFromSlider = newValues[0];

    // Update internal state only if it's different from the slider's new value.
    if (Math.abs(internalSliderValue - newValueFromSlider) > 1e-9) {
        setInternalSliderValue(newValueFromSlider);
    }

    // Call the parent's onValueChange only if the new value from slider interaction
    // truly differs from the parent's current 'value' prop.
    if (Math.abs(value - newValueFromSlider) > 1e-9) {
      onValueChange(newValueFromSlider);
    }
  }, [internalSliderValue, value, onValueChange]); // Dependencies reflect what's used inside

  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01;
  const isBoundsValid = !isNaN(min) && !isNaN(max) && min < max;
  const displayValueInLabel = isNaN(value) ? "N/A" : value.toFixed(3);
  
  const sliderComponentDriveValue = isBoundsValid 
    ? Math.max(min, Math.min(max, internalSliderValue)) 
    : (isBoundsValid ? min : 0);

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
            <ShadSlider // Use aliased import
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
      <ShadSlider // Use aliased import
        id="x-slider-calculus"
        value={[sliderComponentDriveValue]}
        onValueChange={handleSliderInteraction}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${displayValueInLabel}`}
        disabled={!isBoundsValid}
      />
    </div>
  );
}
