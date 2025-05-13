
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GraphViewSettings } from '@/types/graphify';
import { ZoomIn, ZoomOut, RefreshCw, Settings2, CheckSquare, Square, Grid as GridIcon, Axe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as React from 'react';

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
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    setTempSettings(viewSettings);
  }, [viewSettings]);

  const handleInputChange = (field: keyof Pick<GraphViewSettings, 'xMin' | 'xMax' | 'yMin' | 'yMax'>, value: string) => {
    const numValue = parseFloat(value);
    // Allow empty string for typing, or if value becomes NaN (e.g. from just "-")
    // When applying, these will be filtered or validated.
    setTempSettings(prev => ({ ...prev, [field]: value === '' || value === '-' || isNaN(numValue) ? value : numValue }));
  };
  
  const handleCheckboxChange = (field: keyof Pick<GraphViewSettings, 'autoScaleY' | 'grid'>, checked: boolean) => {
    setTempSettings(prev => ({ ...prev, [field]: checked }));
     // Apply immediately for simple toggles like grid if desired
     if (field === 'grid') {
        onViewSettingsChange({ [field]: checked });
     }
     if (field === 'autoScaleY' && checked) { // If autoScaleY is checked, apply immediately and clear manual Y bounds
        onViewSettingsChange({ autoScaleY: true, yMin: undefined, yMax: undefined } as Partial<GraphViewSettings>);
     } else if (field === 'autoScaleY' && !checked) { // If unchecked, user will likely set manual bounds
        onViewSettingsChange({ autoScaleY: false });
     }
  };

  const handleApplySettings = () => {
    const parsedXMin = parseFloat(String(tempSettings.xMin));
    const parsedXMax = parseFloat(String(tempSettings.xMax));
    const parsedYMin = parseFloat(String(tempSettings.yMin));
    const parsedYMax = parseFloat(String(tempSettings.yMax));

    const finalSettings: Partial<GraphViewSettings> = { autoScaleY: tempSettings.autoScaleY, grid: tempSettings.grid };

    if (!isNaN(parsedXMin)) finalSettings.xMin = parsedXMin;
    if (!isNaN(parsedXMax)) finalSettings.xMax = parsedXMax;
    
    if (finalSettings.xMin !== undefined && finalSettings.xMax !== undefined && finalSettings.xMin >= finalSettings.xMax) {
        alert("X Min must be less than X Max.");
        return;
    }

    if (!tempSettings.autoScaleY) {
      if (!isNaN(parsedYMin)) finalSettings.yMin = parsedYMin;
      if (!isNaN(parsedYMax)) finalSettings.yMax = parsedYMax;
      if (finalSettings.yMin !== undefined && finalSettings.yMax !== undefined && finalSettings.yMin >= finalSettings.yMax) {
          alert("Y Min must be less than Y Max for manual scaling.");
          return;
      }
    } else {
      finalSettings.yMin = undefined; // Let function-plot handle auto
      finalSettings.yMax = undefined;
    }
    
    onViewSettingsChange(finalSettings);
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 bg-muted/30 rounded-md shadow-sm border">
      <div className="flex gap-1 sm:gap-1.5">
        <Button onClick={() => onZoom(0.8)} variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Zoom In" aria-label="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button onClick={() => onZoom(1.25)} variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Zoom Out" aria-label="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button onClick={onResetView} variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Reset View" aria-label="Reset View">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Graph Settings" aria-label="Graph Settings">
            <Settings2 className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 sm:w-72 space-y-3 p-3 sm:p-4">
          <h4 className="font-medium text-sm flex items-center gap-1.5"><Axe className="w-4 h-4"/>Axis Bounds</h4>
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
          <div className="flex items-center space-x-2 mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto data-[state=checked]:bg-transparent"
              onClick={() => handleCheckboxChange('autoScaleY', !tempSettings.autoScaleY)}
              data-state={tempSettings.autoScaleY ? 'checked' : 'unchecked'}
              aria-pressed={!!tempSettings.autoScaleY}
            >
              {tempSettings.autoScaleY ? <CheckSquare className="w-4 h-4 text-primary"/> : <Square className="w-4 h-4 text-muted-foreground"/>}
            </Button>
            <Label htmlFor="autoScaleY-graph" className="text-xs cursor-pointer" onClick={() => handleCheckboxChange('autoScaleY', !tempSettings.autoScaleY)}>
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
           <div className="flex items-center space-x-2 mt-1 border-t pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto data-[state=checked]:bg-transparent"
              onClick={() => handleCheckboxChange('grid', !tempSettings.grid)}
              data-state={tempSettings.grid ? 'checked' : 'unchecked'}
              aria-pressed={!!tempSettings.grid}
            >
              {tempSettings.grid ? <CheckSquare className="w-4 h-4 text-primary"/> : <Square className="w-4 h-4 text-muted-foreground"/>}
            </Button>
            <Label className="text-xs cursor-pointer flex items-center gap-1" onClick={() => handleCheckboxChange('grid', !tempSettings.grid)}>
             <GridIcon className="w-3.5 h-3.5"/> Show Grid
            </Label>
          </div>
          <Button onClick={handleApplySettings} size="sm" className="w-full mt-2 text-xs h-8">Apply Settings</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
