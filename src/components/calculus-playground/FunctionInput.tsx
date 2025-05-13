
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings2, RefreshCw, Trash2, Palette, AlertTriangle, PlusCircle } from 'lucide-react'; // Added PlusCircle
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export interface DomainOptions {
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
}

export interface FunctionInputType {
  id: string;
  expression: string;
  color: string;
  integralBounds: { a: string; b: string };
  error?: string | null;
  // Add integralValue if it's managed per function and displayed here
  integralValue?: number; 
}

interface FunctionInputProps {
  functions: FunctionInputType[];
  onAddFunction: () => void;
  onUpdateFunction: (id: string, updates: Partial<Omit<FunctionInputType, 'id'>>) => void;
  onDeleteFunction: (id: string) => void;
  domainOptions: DomainOptions;
  onDomainOptionsChange: (newOptions: DomainOptions) => void;
  onResetDomainOptions: () => void;
}

const PREDEFINED_COLORS_PICKER = [
  'hsl(var(--primary))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))',
  'hsl(var(--destructive))', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#22D3EE'
];

export default function FunctionInput({
  functions,
  onAddFunction,
  onUpdateFunction,
  onDeleteFunction,
  domainOptions,
  onDomainOptionsChange,
  onResetDomainOptions,
}: FunctionInputProps) {
  const [tempDomainOptions, setTempDomainOptions] = React.useState<DomainOptions>(domainOptions);
  const [isSettingsPopoverOpen, setIsSettingsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    setTempDomainOptions(domainOptions);
  }, [domainOptions]);

  const handleDomainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDomainOptions(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleApplyDomainChanges = () => {
    const newXMin = parseFloat(tempDomainOptions.xMin);
    const newXMax = parseFloat(tempDomainOptions.xMax);
    if (!isNaN(newXMin) && !isNaN(newXMax) && newXMin >= newXMax) {
      alert("X Min must be less than X Max."); return;
    }
    if (tempDomainOptions.yMin.toLowerCase() !== 'auto' && tempDomainOptions.yMax.toLowerCase() !== 'auto') {
      const newYMin = parseFloat(tempDomainOptions.yMin);
      const newYMax = parseFloat(tempDomainOptions.yMax);
      if (!isNaN(newYMin) && !isNaN(newYMax) && newYMin >= newYMax) {
        alert("Y Min must be less than Y Max if both are numbers."); return;
      }
    }
    onDomainOptionsChange(tempDomainOptions);
    setIsSettingsPopoverOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-base font-semibold">Functions & Graph Settings:</Label>
        <Popover open={isSettingsPopoverOpen} onOpenChange={setIsSettingsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Graph Settings">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4 p-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Graph Scale</h4>
                <p className="text-sm text-muted-foreground">
                  Set custom axis bounds. Use 'auto' for Y-axis. Scroll graph to zoom.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="xMin" className="text-xs">X Min</Label><Input id="xMin" name="xMin" value={tempDomainOptions.xMin} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="-10"/></div>
                <div><Label htmlFor="xMax" className="text-xs">X Max</Label><Input id="xMax" name="xMax" value={tempDomainOptions.xMax} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="10"/></div>
                <div><Label htmlFor="yMin" className="text-xs">Y Min</Label><Input id="yMin" name="yMin" value={tempDomainOptions.yMin} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="auto"/></div>
                <div><Label htmlFor="yMax" className="text-xs">Y Max</Label><Input id="yMax" name="yMax" value={tempDomainOptions.yMax} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="auto"/></div>
              </div>
              <div className='flex gap-2'>
                <Button onClick={handleApplyDomainChanges} className="w-full h-9">Apply Scale</Button>
                <Button onClick={onResetDomainOptions} variant="outline" className="w-full h-9 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5"/> Reset View
                </Button>
              </div>
            </PopoverContent>
          </Popover>
      </div>
      
      <TooltipProvider delayDuration={100}>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border rounded-md p-2 bg-muted/10">
          {functions.map((func, index) => (
            <div key={func.id} className="p-2 border rounded-md bg-background shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0 rounded-full focus-visible:ring-offset-0 focus-visible:ring-1"
                        title="Change function color"
                        style={{ backgroundColor: func.color, border: '1px solid hsl(var(--border))' }}
                        aria-label="Change function color"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 bg-popover shadow-lg rounded-md">
                        <div className="grid grid-cols-6 gap-0.5">
                        {PREDEFINED_COLORS_PICKER.map((color) => (
                            <Button
                            key={color}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-sm hover:bg-accent p-0.5"
                            onClick={() => onUpdateFunction(func.id, { color })}
                            aria-label={`Select color ${color}`}
                            >
                            <div className="w-4 h-4 rounded-sm border border-border" style={{ backgroundColor: color }} />
                            </Button>
                        ))}
                        </div>
                    </PopoverContent>
                 </Popover>

                <Input
                  id={`function-input-${func.id}`}
                  type="text"
                  value={func.expression}
                  onChange={(e) => onUpdateFunction(func.id, { expression: e.target.value })}
                  placeholder={`f${index + 1}(x) e.g., x^2`}
                  className={cn("text-sm flex-grow h-8 focus-visible:ring-1", func.error ? "border-destructive focus-visible:ring-destructive text-destructive pr-7" : "")}
                  aria-label={`Function ${index + 1} expression`}
                />
                {func.error && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 -ml-7 mr-1" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-destructive text-destructive-foreground p-1.5 text-xs">
                      <p>{func.error}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/90" onClick={() => onDeleteFunction(func.id)} disabled={functions.length <= 1} aria-label="Delete function">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Label htmlFor={`integral-a-${func.id}`} className="whitespace-nowrap">Integral from a=</Label>
                <Input
                  id={`integral-a-${func.id}`}
                  type="text" 
                  value={func.integralBounds.a}
                  onChange={(e) => onUpdateFunction(func.id, { integralBounds: { ...func.integralBounds, a: e.target.value }})}
                  className="h-7 w-20 text-xs"
                  placeholder="0"
                  aria-label={`Integral lower bound for function ${index + 1}`}
                />
                <Label htmlFor={`integral-b-${func.id}`} className="whitespace-nowrap">to b=</Label>
                <Input
                  id={`integral-b-${func.id}`}
                  type="text"
                  value={func.integralBounds.b}
                  onChange={(e) => onUpdateFunction(func.id, { integralBounds: { ...func.integralBounds, b: e.target.value }})}
                  className="h-7 w-20 text-xs"
                  placeholder="x"
                  aria-label={`Integral upper bound for function ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
      <Button onClick={onAddFunction} variant="outline" className="w-full mt-2">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Function
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Supported: x, numbers, +, -, *, /, ^, sqrt(), sin(), cos(), tan(), atan(), ln(), log10(), exp(), abs(), e, pi.
      </p>
    </div>
  );
}
