// src/components/debug/PerformanceOverlay.tsx
'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime?: number; // ms
  fps?: number;
  // Add more metrics as needed
}

interface PerformanceOverlayProps {
  metrics?: PerformanceMetrics; // Allow passing metrics, or calculate internally
}

export default function PerformanceOverlay({ metrics: initialMetrics }: PerformanceOverlayProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(initialMetrics || null);
  const [isVisible, setIsVisible] = useState(true); // Could be controlled by a global debug state

  useEffect(() => {
    // Placeholder for performance monitoring logic
    // This could use requestAnimationFrame to calculate FPS,
    // or PerformanceObserver for paint/render times.
    // For now, it's a static display or relies on passed props.
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [initialMetrics]);

  if (!isVisible || !metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-[60] p-3 bg-black/70 text-white text-xs font-mono rounded-md shadow-lg space-y-1 w-48">
      <h4 className="font-bold text-sm border-b border-gray-600 pb-1 mb-1 text-yellow-400">Perf Overlay</h4>
      {metrics.renderTime !== undefined && (
        <div>Render Time: <span className="text-green-400">{metrics.renderTime.toFixed(2)} ms</span></div>
      )}
      {metrics.fps !== undefined && (
        <div>FPS: <span className="text-green-400">{metrics.fps.toFixed(1)}</span></div>
      )}
      {/* Add more metrics here */}
      {!metrics.renderTime && !metrics.fps && (
        <div className="text-gray-400">No metrics to display.</div>
      )}
    </div>
  );
}
