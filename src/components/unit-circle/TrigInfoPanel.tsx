'use client';

interface TrigInfoPanelProps {
  angleRadians: number;
}

export default function TrigInfoPanel({ angleRadians }: TrigInfoPanelProps) {
  const cosValue = Math.cos(angleRadians);
  const sinValue = Math.sin(angleRadians);
  let tanValue: number | string = Math.tan(angleRadians);

  // Handle undefined tan (when cos is close to 0)
  if (Math.abs(cosValue) < 1e-10) {
    tanValue = "Undefined";
  } else {
    tanValue = tanValue.toFixed(3);
  }
  
  // Special formatting for 0, 1, -1 to avoid -0.000
  const formatTrigValue = (value: number): string => {
    if (Math.abs(value) < 1e-10) return "0.000";
    if (Math.abs(value - 1) < 1e-10) return "1.000";
    if (Math.abs(value + 1) < 1e-10) return "-1.000";
    return value.toFixed(3);
  }

  return (
    <div className="grid grid-cols-1 min-[450px]:grid-cols-3 gap-2 text-sm">
      <div className="p-3 bg-muted/50 rounded-lg shadow-sm">
        <span className="font-semibold text-muted-foreground block">cos(θ)</span>
        <span className="font-mono text-lg text-foreground">{formatTrigValue(cosValue)}</span>
      </div>
      <div className="p-3 bg-muted/50 rounded-lg shadow-sm">
        <span className="font-semibold text-muted-foreground block">sin(θ)</span>
        <span className="font-mono text-lg text-foreground">{formatTrigValue(sinValue)}</span>
      </div>
      <div className="p-3 bg-muted/50 rounded-lg shadow-sm">
        <span className="font-semibold text-muted-foreground block">tan(θ)</span>
        <span className="font-mono text-lg text-foreground">{tanValue}</span>
      </div>
    </div>
  );
}
