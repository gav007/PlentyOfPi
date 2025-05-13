
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

export default function SliderControl({ value, onValueChange, min, max, step }: SliderControlProps) {
  // Internal state for the slider, initialized with the parent's value.
  // The slider component will be controlled by this internal state.
  const [internalSliderValue, setInternalSliderValue] = React.useState(value);

  // Effect to sync internal state when the parent's 'value' prop changes.
  // This ensures that if the value is updated externally (e.g., by clicking on the graph),
  // the slider reflects this change.
  React.useEffect(() => {
    // Clamping logic to ensure the value passed to setInternalSliderValue is valid.
    const isBoundsValidForEffect = !isNaN(min) && !isNaN(max) && min < max;
    const safeParentValueForEffect = isNaN(value) ? (isBoundsValidForEffect ? min : 0) : value;
    const clampedParentValueForEffect = isBoundsValidForEffect 
      ? Math.max(min, Math.min(max, safeParentValueForEffect)) 
      : (isBoundsValidForEffect ? min : 0);

    // Only update the internal state if the (potentially clamped) parent value
    // is different from the current internal state. This helps prevent loops.
    if (clampedParentValueForEffect !== internalSliderValue) {
      setInternalSliderValue(clampedParentValueForEffect);
    }
  }, [value, min, max, internalSliderValue]); // Dependencies: parent value, bounds, and internal value itself.

  // Callback for when the user interacts with the slider.
  const handleSliderInteraction = React.useCallback((newValues: number[]) => {
    const newValueFromSlider = newValues[0];
    setInternalSliderValue(newValueFromSlider); // Update internal state immediately for responsive slider thumb.

    // Only call the parent's onValueChange if the new value from slider interaction
    // truly differs from the parent's current 'value' prop.
    // This check is crucial to prevent infinite update loops.
    if (Math.abs(value - newValueFromSlider) > 1e-9) { // Using a small tolerance for float comparison
      onValueChange(newValueFromSlider);
    }
  }, [onValueChange, value]); // Dependencies: parent's onValueChange callback and parent's current value.

  // Determine effective step and validity of bounds for rendering.
  const effectiveStep = (max > min && step > 1e-9 && isFinite(step)) ? step : 0.01;
  const isBoundsValid = !isNaN(min) && !isNaN(max) && min < max;

  // The value displayed in the <span> next to the label.
  // This should ideally reflect the parent's 'value' as it's the source of truth for calculations.
  const displayValueInLabel = isNaN(value) ? "N/A" : value.toFixed(3);
  
  // The value prop for the <Slider> component should be derived from internalSliderValue,
  // and it must be clamped to the slider's min/max to avoid Radix UI errors.
  const sliderComponentDriveValue = isBoundsValid 
    ? Math.max(min, Math.min(max, internalSliderValue)) 
    : (isBoundsValid ? min : 0);

  // Render a disabled state if bounds are invalid.
  if (!isBoundsValid) {
     return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label htmlFor="x-slider-calculus" className="text-base font-semibold">
                Adjust x-value (or click on graph):
                </Label>
                <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
                N/A
                </span>
            </div>
            <Slider
                id="x-slider-calculus"
                value={[0]} // Default valid value
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
        <Label htmlFor="x-slider-calculus" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {displayValueInLabel}
        </span>
      </div>
      <Slider
        id="x-slider-calculus"
        value={[sliderComponentDriveValue]} // Slider is driven by its internal (clamped) state.
        onValueChange={handleSliderInteraction} // User interaction updates internal state & conditionally parent.
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${displayValueInLabel}`}
        disabled={!isBoundsValid}
      />
    </div>
  );
}
