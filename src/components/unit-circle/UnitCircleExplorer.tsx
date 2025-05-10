'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, HelpCircle, Orbit, Sigma, Waves } from 'lucide-react';
import UnitCircleCanvas from './UnitCircleCanvas';
import AngleDisplay from './AngleDisplay';
import TrigInfoPanel from './TrigInfoPanel';
import SineWavePlot from './SineWavePlot';

const SVG_SIZE = 320; // Default size for the SVG canvas, can be made responsive
const SINE_WAVE_HEIGHT = 150;

export default function UnitCircleExplorer() {
  const [angle, setAngle] = useState<number>(Math.PI / 4); // Initial angle (45 degrees)
  const [showCheatOverlay, setShowCheatOverlay] = useState<boolean>(false);

  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Orbit className="w-8 h-8" />
          Unit Circle Explorer
        </h1>
        <p className="text-muted-foreground mt-1">
          Drag the point on the circle to see how angles, trigonometric values, and the sine wave are connected.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Orbit className="w-6 h-6 text-primary" />
              Interactive Unit Circle
            </CardTitle>
            <CardDescription>Drag the handle on the circle.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <UnitCircleCanvas
              angle={angle}
              onAngleChange={handleAngleChange}
              showCheatOverlay={showCheatOverlay}
              size={SVG_SIZE}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sigma className="w-6 h-6 text-primary" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AngleDisplay angleRadians={angle} />
              <TrigInfoPanel angleRadians={angle} />
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Switch
                  id="cheat-overlay-toggle"
                  checked={showCheatOverlay}
                  onCheckedChange={setShowCheatOverlay}
                  aria-label="Toggle cheat sheet overlay"
                />
                <Label htmlFor="cheat-overlay-toggle" className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" /> Show Helper Lines & Labels
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-6 h-6 text-primary" />
            Sine Wave Visualization
          </CardTitle>
          <CardDescription>
            This graph shows sin(θ) as the angle θ changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SineWavePlot
            angle={angle}
            height={SINE_WAVE_HEIGHT}
          />
        </CardContent>
      </Card>
    </div>
  );
}
