
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, Settings2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DomainOptions {
  xMin: string; // Use string to allow 'auto' and numerical values
  xMax: string;
  yMin: string;
  yMax: string;
}

interface FunctionInputProps {
  functionStr: string;
  onFunctionStrChange: (newStr: string) => void;
  domainOptions: DomainOptions;
  onDomainOptionsChange: (newOptions: DomainOptions) => void;
}

export default function FunctionInput({
  functionStr,
  onFunctionStrChange,
  domainOptions,
  onDomainOptionsChange,
}: FunctionInputProps) {
  const [inputValue, setInputValue] = React.useState(functionStr);
  const [tempDomainOptions, setTempDomainOptions] = React.useState<DomainOptions>(domainOptions);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);


  React.useEffect(() => {
    setInputValue(functionStr);
  }, [functionStr]);

  React.useEffect(() => {
    // Update temporary options when global domainOptions change, e.g. on initial load or external reset
    setTempDomainOptions(domainOptions);
  }, [domainOptions]);

  const handleSubmitFunction = (e: React.FormEvent) => {
    e.preventDefault();
    onFunctionStrChange(inputValue);
  };

  const handleDomainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDomainOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyDomainChanges = () => {
    // Basic validation
    const xMinNum = parseFloat(tempDomainOptions.xMin);
    const xMaxNum = parseFloat(tempDomainOptions.xMax);
    if (!isNaN(xMinNum) && !isNaN(xMaxNum) && xMinNum >= xMaxNum) {
      alert("X Min must be less than X Max.");
      // Optionally, revert tempDomainOptions.xMin or xMax to previous valid values or defaults
      // For now, just alert and don't apply.
      return;
    }
    
    const yMinNum = parseFloat(tempDomainOptions.yMin);
    const yMaxNum = parseFloat(tempDomainOptions.yMax);
    if (tempDomainOptions.yMin.toLowerCase() !== 'auto' && tempDomainOptions.yMax.toLowerCase() !== 'auto') {
      if (!isNaN(yMinNum) && !isNaN(yMaxNum) && yMinNum >= yMaxNum) {
         alert("Y Min must be less than Y Max if both are numbers.");
         return;
      }
    }
    onDomainOptionsChange(tempDomainOptions);
    setIsPopoverOpen(false); // Close popover on apply
  };
  
  const handleResetDomainToDefaults = () => {
    const defaultOptions = { xMin: '-10', xMax: '10', yMin: 'auto', yMax: 'auto' };
    setTempDomainOptions(defaultOptions); // Update temp state
    // onDomainOptionsChange(defaultOptions); // Optionally apply immediately, or wait for "Apply Scale"
  };


  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmitFunction} className="space-y-2">
        <Label htmlFor="function-input" className="text-base font-semibold">Enter function f(x):</Label>
        <div className="flex items-center gap-2">
          <Input
            id="function-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., x^2, sin(x), sqrt(x)"
            className="text-base flex-grow"
          />
          <Button type="submit" size="icon" aria-label="Plot function">
            <Send className="h-5 w-5" />
          </Button>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Graph Settings">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4 p-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Graph Scale</h4>
                <p className="text-sm text-muted-foreground">
                  Set custom axis bounds. Use 'auto' for automatic Y-axis scaling.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="xMin" className="text-xs">X Min</Label>
                  <Input id="xMin" name="xMin" value={tempDomainOptions.xMin} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="-10"/>
                </div>
                <div>
                  <Label htmlFor="xMax" className="text-xs">X Max</Label>
                  <Input id="xMax" name="xMax" value={tempDomainOptions.xMax} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="10"/>
                </div>
                <div>
                  <Label htmlFor="yMin" className="text-xs">Y Min</Label>
                  <Input id="yMin" name="yMin" value={tempDomainOptions.yMin} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="auto"/>
                </div>
                <div>
                  <Label htmlFor="yMax" className="text-xs">Y Max</Label>
                  <Input id="yMax" name="yMax" value={tempDomainOptions.yMax} onChange={handleDomainInputChange} className="h-8 text-sm" placeholder="auto"/>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button onClick={handleApplyDomainChanges} className="w-full h-9">Apply Scale</Button>
                <Button onClick={handleResetDomainToDefaults} variant="outline" className="w-full h-9">Reset</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-muted-foreground">
          Supported: x, numbers, +, -, *, /, ^, sqrt(), sin(), cos(), tan(), ln(), log10(), exp(), abs(). Example: <code>2*x^3 + sin(x/2)</code>
        </p>
      </form>
    </div>
  );
}

    