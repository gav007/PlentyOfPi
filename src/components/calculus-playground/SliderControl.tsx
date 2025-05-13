
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
  const [internalSliderValue, setInternalSliderValue] = React.useState(value);

  // Synchronize internal state when the parent's `value` prop changes,
  // but only if it's meaningfully different from the internal state.
  React.useEffect(() => {
    const isBoundsValidForEffect = !isNaN(min) && !isNaN(max) && min < max;
    let clampedParentValue = value;

    if (isNaN(value)) {
      clampedParentValue = isBoundsValidForEffect ? min : 0;
    } else if (isBoundsValidForEffect) {
      clampedParentValue = Math.max(min, Math.min(max, value));
    }
    // Only update internal state if the (potentially clamped) parent value
    // is different from the current internal state. This check is crucial.
    if (Math.abs(clampedParentValue - internalSliderValue) > 1e-9) { // Use a small epsilon for float comparison
      setInternalSliderValue(clampedParentValue);
    }
  }, [value, min, max, internalSliderValue]); // internalSliderValue added to deps as per best practice, but the condition above is key

  // Callback for when the user interacts with the ShadCN slider.
  // This updates the internal state and then conditionally calls the parent's onValueChange.
  const handleSliderValueChange = React.useCallback((newValues: number[]) => {
    const newValueFromSlider = newValues[0];
    
    // Update internal state immediately for a responsive UI feel
    setInternalSliderValue(newValueFromSlider);

    // Only propagate the change to the parent if the new value from the slider
    // is actually different from the parent's current `value` prop.
    // This prevents calling onValueChange if the change was purely internal or due to prop sync.
    if (Math.abs(value - newValueFromSlider) > 1e-9) {
      onValueChange(newValueFromSlider);
    }
  }, [value, onValueChange]); // onValueChange and value are dependencies.

  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01;
  const isBoundsValid = !isNaN(min) && !isNaN(max) && min < max;
  const displayValueInLabel = isNaN(value) ? "N/A" : value.toFixed(3);
  
  // The value passed to ShadSlider should be the internal state, clamped to current bounds.
  const sliderComponentDriveValue = isBoundsValid 
    ? Math.max(min, Math.min(max, internalSliderValue)) 
    : (isBoundsValid ? min : 0); // Fallback if bounds are not fully valid

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
                value={[0]} // Static value for disabled state
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
        value={[sliderComponentDriveValue]} // Pass internal, clamped value as an array
        onValueChange={handleSliderValueChange} // Use the memoized handler
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${displayValueInLabel}`}
        disabled={!isBoundsValid}
      />
    </div>
  );
}
