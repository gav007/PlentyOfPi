'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FourierControls from './FourierControls';
import EpicycleCanvas from './EpicycleCanvas';
import WaveformPlot from './WaveformPlot';
import { FunctionSquare } from 'lucide-react';

const MAX_TERMS = 50; 
const TIME_PERIOD = 2 * Math.PI; 
const WAVEFORM_POINTS = 200; 

export default function FourierVisualizer() {
  const [numTerms, setNumTerms] = useState(1);
  const [animTime, setAnimTime] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.01); 

  const [epicycleData, setEpicycleData] = useState<Array<{ x: number; y: number; radius: number; angle: number, tipX: number, tipY: number }>>([]);
  const [waveformPath, setWaveformPath] = useState<Array<{ x: number; y: number }>>([]);
  const [currentWaveformPoint, setCurrentWaveformPoint] = useState<{ x: number; y: number } | null>(null);
  const [tracedPath, setTracedPath] = useState<Array<{x: number, y:number}>>([]);

  const requestRef = useRef<number>();

  const calculateFourierSum = useCallback((t: number, N: number): number => {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const harmonic = 2 * k + 1;
      sum += (4 / (harmonic * Math.PI)) * Math.sin(harmonic * t);
    }
    return sum;
  }, []);

  useEffect(() => {
    const path = [];
    for (let i = 0; i <= WAVEFORM_POINTS; i++) {
      const t = (i / WAVEFORM_POINTS) * TIME_PERIOD;
      const y = calculateFourierSum(t, numTerms);
      path.push({ x: t, y });
    }
    setWaveformPath(path);
    setTracedPath([]); 
    setAnimTime(0); 
  }, [numTerms, calculateFourierSum]);

  useEffect(() => {
    const epicyclesResult = [];
    let currentX = 0;
    let currentY = 0;

    for (let k = 0; k < numTerms; k++) {
      const harmonic = 2 * k + 1;
      const radius = 4 / (harmonic * Math.PI);
      const angle = harmonic * animTime; 

      const prevX = currentX;
      const prevY = currentY;

      currentX += radius * Math.cos(angle);
      currentY += radius * Math.sin(angle);

      epicyclesResult.push({
        x: prevX, 
        y: prevY,
        radius,
        angle,
        tipX: currentX, 
        tipY: currentY,
      });
    }
    setEpicycleData(epicyclesResult);
    setCurrentWaveformPoint({ x: animTime, y: currentY }); 

    if (isPlaying) {
        setTracedPath(prev => {
            const newPath = [...prev, {x: animTime, y: currentY}];
            if (newPath.length > WAVEFORM_POINTS * 2) { 
                return newPath.slice(newPath.length - WAVEFORM_POINTS * 2);
            }
            return newPath;
        });
    }

  }, [animTime, numTerms, calculateFourierSum, isPlaying]);

  const animate = useCallback(() => {
    if (isPlaying) {
      setAnimTime(prevTime => {
        let nextTime = prevTime + animationSpeed;
        if (nextTime >= TIME_PERIOD) {
          nextTime = 0; 
          setTracedPath([]); 
        }
        return nextTime;
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, animationSpeed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <FunctionSquare className="w-8 h-8" />
          Fourier Series Visualizer
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          See how complex waves are built from simple sine waves (epicycles). Visualizing a square wave.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FourierControls
          numTerms={numTerms}
          onNumTermsChange={setNumTerms}
          maxTerms={MAX_TERMS}
          isPlaying={isPlaying}
          onPlayPauseChange={setIsPlaying}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
        />
        {/* Changed to a single column grid for stacking visualizations */}
        <div className="grid grid-cols-1 gap-6 items-center">
          <div className="w-full max-w-md mx-auto"> {/* Centering and constraining width of epicycle */}
            <EpicycleCanvas
              epicycleData={epicycleData}
              width={300} 
              height={300}
              currentSeriesValue={currentWaveformPoint?.y ?? 0}
            />
          </div>
          <div className="w-full"> {/* Waveform plot can take more width */}
            <WaveformPlot
              fullWaveformPath={waveformPath}
              tracedWaveformPath={tracedPath}
              currentTime={animTime}
              currentValue={currentWaveformPoint?.y ?? 0}
              timePeriod={TIME_PERIOD}
              width={500} // Keep a reasonable default width or make responsive via parent
              height={300}
            />
          </div>
        </div>
         {/* Moved equation display below the visualizations */}
         <div className="p-4 mt-4 bg-muted/50 rounded-md text-center">
            <p className="text-sm text-muted-foreground">
                Square Wave Fourier Series:
            </p>
            <p className="font-mono text-xs sm:text-sm text-primary overflow-x-auto">
                SF(t) = &Sigma;<sub>k=0</sub><sup>N-1</sup> (4 / ((2k+1)&pi;)) * sin((2k+1)t)
            </p>
        </div>
      </CardContent>
    </Card>
  );
}