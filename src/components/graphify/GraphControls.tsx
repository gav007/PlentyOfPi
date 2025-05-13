
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GraphViewSettings } from '@/types/graphify';
import { ZoomIn, ZoomOut, RefreshCw, Settings2, CheckSquare, Square } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as React from 'react'; // Import React for useState

interface GraphControlsProps {
  viewSettings: GraphViewSettings;
  onViewSettingsChange: (settings: Partial<GraphViewSettings>) => void;
  onResetView: () => void;
  onZoom: (factor: number) => void;
}

export default function GraphControls({ 
  viewSettings, 
  onViewSettingsChange,
  onResetView,
  onZoom
}: GraphControlsProps) {
  const [tempSettings, setTempSettings] = React.useState(viewSettings);

  React.useEffect(() => {
    setTempSettings(viewSettings);
  }, [viewSettings]);

  const handleInputChange = (field: keyof GraphViewSettings, value: string | boolean) => {
    if (typeof value === 'boolean' && field === 'autoScaleY') {
      setTempSettings(prev => ({ ...prev, [field]: value }));
    } else if (typeof value === 'string') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) || value === '' || value === '-') { // Allow empty or just minus for typing
        setTempSettings(prev => ({ ...prev, [field]: numValue }));
      }
    }
  };

  const handleApplySettings = () => {
    // Filter out NaN values before applying
    const validSettings: Partial<GraphViewSettings> = {};
    if (!isNaN(tempSettings.xMin)) validSettings.xMin = tempSettings.xMin;
    if (!isNaN(tempSettings.xMax)) validSettings.xMax = tempSettings.xMax;
    if (!isNaN(tempSettings.yMin) && !tempSettings.autoScaleY) validSettings.yMin = tempSettings.yMin;
    if (!isNaN(tempSettings.yMax) && !tempSettings.autoScaleY) validSettings.yMax = tempSettings.yMax;
    validSettings.autoScaleY = tempSettings.autoScaleY;
    
    onViewSettingsChange(validSettings);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/30 rounded-md shadow-sm border">
      <div className="flex gap-1.5">
        <Button onClick={() => onZoom(0.8)} variant="outline" size="icon" title="Zoom In" aria-label="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button onClick={() => onZoom(1.25)} variant="outline" size="icon" title="Zoom Out" aria-label="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button onClick={onResetView} variant="outline" size="icon" title="Reset View" aria-label="Reset View">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" title="Graph Settings" aria-label="Graph Settings">
            <Settings2 className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 space-y-3 p-4">
          <h4 className="font-medium text-sm">Axis Bounds</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="xMin-graph" className="text-xs">X Min</Label>
              <Input id="xMin-graph" type="number" value={String(tempSettings.xMin)} onChange={e => handleInputChange('xMin', e.target.value)} className="h-8 text-xs"/>
            </div>
            <div>
              <Label htmlFor="xMax-graph" className="text-xs">X Max</Label>
              <Input id="xMax-graph" type="number" value={String(tempSettings.xMax)} onChange={e => handleInputChange('xMax', e.target.value)} className="h-8 text-xs"/>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto data-[state=checked]:bg-transparent"
              onClick={() => handleInputChange('autoScaleY', !tempSettings.autoScaleY)}
              data-state={tempSettings.autoScaleY ? 'checked' : 'unchecked'}
              aria-pressed={tempSettings.autoScaleY}
            >
              {tempSettings.autoScaleY ? <CheckSquare className="w-4 h-4 text-primary"/> : <Square className="w-4 h-4 text-muted-foreground"/>}
            </Button>
            <Label htmlFor="autoScaleY-graph" className="text-xs cursor-pointer" onClick={() => handleInputChange('autoScaleY', !tempSettings.autoScaleY)}>
              Autoscale Y-Axis
            </Label>
          </div>
          {!tempSettings.autoScaleY && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="yMin-graph" className="text-xs">Y Min</Label>
                <Input id="yMin-graph" type="number" value={String(tempSettings.yMin)} onChange={e => handleInputChange('yMin', e.target.value)} className="h-8 text-xs"/>
              </div>
              <div>
                <Label htmlFor="yMax-graph" className="text-xs">Y Max</Label>
                <Input id="yMax-graph" type="number" value={String(tempSettings.yMax)} onChange={e => handleInputChange('yMax', e.target.value)} className="h-8 text-xs"/>
              </div>
            </div>
          )}
          <Button onClick={handleApplySettings} size="sm" className="w-full mt-2 text-xs h-8">Apply Settings</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
