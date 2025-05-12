
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { Repeat, Binary } from 'lucide-react'; // Repeat for recursion

type RecursionExampleType = 'factorial' | 'fibonacci' | 'hanoi';
const RECURSION_EXAMPLES: { value: RecursionExampleType; label: string; description: string, inputLabel: string, defaultInput: string }[] = [
  { value: 'factorial', label: 'Factorial', description: 'Calculates n! (n * (n-1) * ... * 1). Base case: 0! = 1, 1! = 1.', inputLabel: 'Enter n (0-12)', defaultInput: '5'},
  { value: 'fibonacci', label: 'Fibonacci Sequence', description: 'Each number is the sum of the two preceding ones, usually starting with 0 and 1. F(n) = F(n-1) + F(n-2).', inputLabel: 'Enter n (0-15)', defaultInput: '7' },
  { value: 'hanoi', label: 'Tower of Hanoi', description: 'Puzzle involving moving a stack of disks of different sizes from one peg to another, using a third auxiliary peg, with specific rules.', inputLabel: 'Number of Disks (2-5)', defaultInput: '3' },
];

export default function RecursionVisualizer() {
  const [selectedExample, setSelectedExample] = useState<RecursionExampleType>('factorial');
  const [inputValue, setInputValue] = useState<string>(RECURSION_EXAMPLES[0].defaultInput);
  const [parsedInput, setParsedInput] = useState<number>(parseInt(RECURSION_EXAMPLES[0].defaultInput, 10));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  
  const exampleDetails = RECURSION_EXAMPLES.find(ex => ex.value === selectedExample);

  const resetVisualization = useCallback(() => {
    setIsPlaying(false);
    setExplanation(exampleDetails?.description || '');
    // Reset visualization state (call stack, animation step)
  }, [exampleDetails]);

  useEffect(() => {
    resetVisualization();
    setInputValue(exampleDetails?.defaultInput || ''); // Reset input field when example changes
    setParsedInput(parseInt(exampleDetails?.defaultInput || '0', 10));
  }, [selectedExample, resetVisualization, exampleDetails]);
  
  useEffect(() => {
    setExplanation(exampleDetails?.description || '');
  }, [selectedExample, exampleDetails]);
  
  const handleExampleChange = (value: string) => {
    setSelectedExample(value as RecursionExampleType);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const num = parseInt(e.target.value, 10);
    setParsedInput(isNaN(num) ? 0 : num); // Default to 0 if NaN
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <Repeat className="w-7 h-7 text-primary"/> Recursion Visualizer
        </CardTitle>
        <CardDescription>Understand Factorial, Fibonacci, and Tower of Hanoi step-by-step.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="recursion-example-select" className="text-sm font-medium">Recursive Example</Label>
            <Select value={selectedExample} onValueChange={handleExampleChange}>
              <SelectTrigger id="recursion-example-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RECURSION_EXAMPLES.map(ex => <SelectItem key={ex.value} value={ex.value}>{ex.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {exampleDetails && (
            <div>
                <Label htmlFor="recursion-input" className="text-sm font-medium">{exampleDetails.inputLabel}</Label>
                <Input id="recursion-input" type="number" value={inputValue} onChange={handleInputChange} placeholder={exampleDetails.defaultInput} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArenaCanvas className="min-h-[250px]">
                <p className="text-muted-foreground text-sm p-4">
                    Main visualization area for {exampleDetails?.label}.
                    Call stack and animation will appear here.
                </p>
            </ArenaCanvas>
            <ArenaCanvas className="min-h-[250px] bg-secondary/10">
                <p className="text-muted-foreground text-sm p-4">
                    Call Stack Visualization / Auxiliary Info.
                </p>
            </ArenaCanvas>
        </div>
        
        <ArenaControls
            onPlay={() => setIsPlaying(true)} // Placeholder
            onPause={() => setIsPlaying(false)} // Placeholder
            onReset={resetVisualization}
            isPlaying={isPlaying}
            onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={`${exampleDetails?.label || "Recursion"} Explanation`}
          currentStepExplanation={
             <>
              <p className="font-semibold">How it works:</p>
              <p className="text-xs mb-2">{exampleDetails?.description || 'Select an example.'}</p>
              <p className="text-xs">Focus on identifying the Base Case and the Recursive Step.</p>
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
