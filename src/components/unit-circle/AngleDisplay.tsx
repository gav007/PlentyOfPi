'use client';

import { Pi } from 'lucide-react';

interface AngleDisplayProps {
  angleRadians: number;
}

export default function AngleDisplay({ angleRadians }: AngleDisplayProps) {
  const degrees = (angleRadians * 180) / Math.PI;

  // Normalize degrees to be in [0, 360)
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  // Normalize radians to be in [0, 2π)
  const normalizedRadians = ((angleRadians % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);


  const formatRadians = (rad: number): string => {
    // Attempt to find common fractions of pi
    const tolerance = 0.001;
    const fractions = [
      { val: 0, str: "0" }, { val: Math.PI/6, str: "π/6" }, { val: Math.PI/4, str: "π/4" },
      { val: Math.PI/3, str: "π/3" }, { val: Math.PI/2, str: "π/2" }, { val: 2*Math.PI/3, str: "2π/3" },
      { val: 3*Math.PI/4, str: "3π/4" }, { val: 5*Math.PI/6, str: "5π/6" }, { val: Math.PI, str: "π" },
      { val: 7*Math.PI/6, str: "7π/6" }, { val: 5*Math.PI/4, str: "5π/4" }, { val: 4*Math.PI/3, str: "4π/3" },
      { val: 3*Math.PI/2, str: "3π/2" }, { val: 5*Math.PI/3, str: "5π/3" }, { val: 7*Math.PI/4, str: "7π/4" },
      { val: 11*Math.PI/6, str: "11π/6" }, { val: 2*Math.PI, str: "2π" }
    ];
    for (const frac of fractions) {
      if (Math.abs(rad - frac.val) < tolerance) return frac.str;
    }
    return rad.toFixed(3);
  };


  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="p-3 bg-muted/50 rounded-lg shadow-sm">
        <span className="font-semibold text-muted-foreground block">RADIANS (θ)</span>
        <span className="font-mono text-lg text-foreground flex items-center">
           {formatRadians(normalizedRadians)}
        </span>
      </div>
      <div className="p-3 bg-muted/50 rounded-lg shadow-sm">
        <span className="font-semibold text-muted-foreground block">DEGREES (°)</span>
        <span className="font-mono text-lg text-foreground">
          {normalizedDegrees.toFixed(1)}°
        </span>
      </div>
    </div>
  );
}
