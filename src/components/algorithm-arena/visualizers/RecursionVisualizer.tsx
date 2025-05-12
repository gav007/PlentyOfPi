
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { Repeat } from 'lucide-react';
import type { RecursionStep, CallStackFrame } from '@/types/recursion-visualizer';
import { generateFactorialSteps, generateFibonacciSteps, generateHanoiSteps } from '@/lib/recursionUtils';

type RecursionExampleType = 'factorial' | 'fibonacci' | 'hanoi';
const RECURSION_EXAMPLES: { value: RecursionExampleType; label: string; description: string; inputLabel: string; defaultInput: string, minInput: number, maxInput: number }[] = [
  { value: 'factorial', label: 'Factorial', description: 'Calculates n! (n * (n-1) * ... * 1). Base case: 0! = 1, 1! = 1.', inputLabel: 'Enter n (0-10)', defaultInput: '5', minInput: 0, maxInput: 10 },
  { value: 'fibonacci', label: 'Fibonacci Sequence', description: 'Each number is the sum of the two preceding ones, usually starting with 0 and 1. F(n) = F(n-1) + F(n-2).', inputLabel: 'Enter n (0-12)', defaultInput: '7', minInput: 0, maxInput: 12 },
  { value: 'hanoi', label: 'Tower of Hanoi', description: 'Puzzle involving moving a stack of disks of different sizes from one peg to another, using a third auxiliary peg, with specific rules.', inputLabel: 'Number of Disks (2-5)', defaultInput: '3', minInput: 2, maxInput: 5 },
];

const BASE_ANIMATION_DELAY_MS = 1000;

interface HanoiPegsState { A: number[]; B: number[]; C: number[]; }

export default function RecursionVisualizer() {
  const [selectedExample, setSelectedExample] = useState<RecursionExampleType>('factorial');
  const [inputValue, setInputValue] = useState<string>(RECURSION_EXAMPLES[0].defaultInput);
  const [parsedInput, setParsedInput] = useState<number>(parseInt(RECURSION_EXAMPLES[0].defaultInput, 10));
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3); // 1-5, ArenaControls default
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<RecursionStep[]>([]);
  
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [hanoiPegs, setHanoiPegs] = useState<HanoiPegsState>({ A: [], B: [], C: [] });
  const [currentCalculation, setCurrentCalculation] = useState<string>("");
  const [finalResult, setFinalResult] = useState<string | number | null>(null);

  const exampleDetails = RECURSION_EXAMPLES.find(ex => ex.value === selectedExample);

  const generateSteps = useCallback(() => {
    if (!exampleDetails) return;
    let newSteps: RecursionStep[];
    switch (selectedExample) {
      case 'factorial':
        newSteps = generateFactorialSteps(parsedInput);
        break;
      case 'fibonacci':
        newSteps = generateFibonacciSteps(parsedInput);
        break;
      case 'hanoi':
        const initialDisks = Array.from({ length: parsedInput }, (_, i) => parsedInput - i);
        setHanoiPegs({ A: initialDisks, B: [], C: [] });
        newSteps = generateHanoiSteps(parsedInput, 'A', 'C', 'B', initialDisks);
        break;
      default:
        newSteps = [];
    }
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCallStack([]);
    setCurrentCalculation("");
    setFinalResult(null);
    if (newSteps.length > 0) {
      updateVisualState(newSteps[0]);
    }
  }, [selectedExample, parsedInput, exampleDetails]);

  const updateVisualState = (step: RecursionStep | undefined) => {
    if (!step) return;
    setCallStack(step.callStack || []);
    setCurrentCalculation(step.computation || "");
    setFinalResult(step.finalResult !== undefined ? step.finalResult : null);
    if (step.hanoiPegsState) {
      setHanoiPegs(step.hanoiPegsState);
    }
  };

  useEffect(() => {
    generateSteps();
    // Reset input value when example changes, respecting new min/max
    const currentExample = RECURSION_EXAMPLES.find(ex => ex.value === selectedExample);
    if (currentExample) {
        const newDefaultInput = parseInt(currentExample.defaultInput, 10);
        setInputValue(String(newDefaultInput));
        setParsedInput(newDefaultInput);
    }
  }, [selectedExample, generateSteps]); // generateSteps dependency is for initial load of default value

   useEffect(() => {
    // This effect processes steps
    if (isPlaying && currentStepIndex < steps.length - 1) {
      const delay = BASE_ANIMATION_DELAY_MS / speed;
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); // Stop at the end
    }

    // Update visuals based on the current step
    if (steps[currentStepIndex]) {
      updateVisualState(steps[currentStepIndex]);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, speed]);


  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
      // If at the end of a completed visualization, reset to replay
      setCurrentStepIndex(0);
      updateVisualState(steps[0]);
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  
  const handleStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    generateSteps(); // This will reset currentStepIndex to 0 and regenerate steps
  };
  
  const handleExampleChange = (value: string) => {
    setSelectedExample(value as RecursionExampleType);
    // useEffect for selectedExample will trigger regeneration
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    let num = parseInt(e.target.value, 10);
    if (exampleDetails) {
        if (isNaN(num) || num < exampleDetails.minInput) num = exampleDetails.minInput;
        if (num > exampleDetails.maxInput) num = exampleDetails.maxInput;
    } else {
        if (isNaN(num)) num = 0;
    }
    setParsedInput(num);
  };
  
  const handleInputBlur = () => { // Ensure parsedInput is up-to-date and reset steps if value changed
    if (String(parsedInput) !== inputValue) { // If user typed something that got clamped
        setInputValue(String(parsedInput)); // Update input field to reflect clamped value
    }
    generateSteps(); // Regenerate steps with the (potentially new) parsedInput
  };

  const currentDisplayStep = steps[currentStepIndex] || { explanation: exampleDetails?.description || "Initializing...", callStack: [] };

  const Disk = ({ diskNumber, pegWidth }: { diskNumber: number, pegWidth: number }) => {
    const maxDisks = exampleDetails?.maxInput || 5;
    const diskHeight = 15;
    const minWidth = pegWidth * 0.3;
    const maxWidth = pegWidth * 0.9;
    const width = minWidth + ((maxWidth - minWidth) / (maxDisks -1)) * (diskNumber -1);
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-indigo-500"];
    
    return <div style={{ width: `${width}px`, height: `${diskHeight}px`}} className={`rounded ${colors[diskNumber % colors.length]} mx-auto mb-0.5 shadow`}></div>;
  };

  const Peg = ({ disks, pegName, pegWidth }: { disks: number[], pegName: string, pegWidth: number }) => (
    <div className="flex flex-col items-center justify-end h-full">
      <div className="flex flex-col-reverse justify-start min-h-[120px] w-full"> {/* Ensure disks stack from bottom */}
        {disks.map(disk => <Disk key={`${pegName}-${disk}`} diskNumber={disk} pegWidth={pegWidth} />)}
      </div>
      <div style={{width: `${pegWidth}px`}} className="h-2 bg-gray-700 rounded-t-sm mt-auto"></div>
      <p className="text-xs font-semibold text-muted-foreground mt-1">{pegName}</p>
    </div>
  );


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
            <Select value={selectedExample} onValueChange={handleExampleChange} disabled={isPlaying}>
              <SelectTrigger id="recursion-example-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RECURSION_EXAMPLES.map(ex => <SelectItem key={ex.value} value={ex.value}>{ex.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {exampleDetails && (
            <div>
                <Label htmlFor="recursion-input" className="text-sm font-medium">{exampleDetails.inputLabel}</Label>
                <Input 
                    id="recursion-input" 
                    type="number" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    placeholder={exampleDetails.defaultInput} 
                    min={exampleDetails.minInput}
                    max={exampleDetails.maxInput}
                    disabled={isPlaying}
                />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArenaCanvas className="min-h-[250px] flex flex-col items-center justify-center">
                {selectedExample === 'hanoi' ? (
                    <div className="flex justify-around w-full h-full p-2 items-end">
                        <Peg disks={hanoiPegs.A} pegName="A" pegWidth={80}/>
                        <Peg disks={hanoiPegs.B} pegName="B" pegWidth={80}/>
                        <Peg disks={hanoiPegs.C} pegName="C" pegWidth={80}/>
                    </div>
                ) : (
                  <>
                    <p className="text-muted-foreground text-sm p-2">
                        Main visualization for {exampleDetails?.label}.
                    </p>
                    {currentCalculation && <p className="font-mono text-center text-primary text-lg my-2 p-2 bg-background/50 rounded">{currentCalculation}</p>}
                     {finalResult !== null && <p className="font-bold text-center text-green-500 text-xl mt-2 p-2 bg-green-500/10 rounded">Result: {finalResult}</p>}
                  </>
                )}
            </ArenaCanvas>
            <ArenaCanvas className="min-h-[250px] bg-secondary/10 p-2">
                 <p className="text-sm font-semibold text-muted-foreground mb-2">Call Stack:</p>
                {callStack.length === 0 && <p className="text-xs text-muted-foreground italic">Stack is empty.</p>}
                <div className="space-y-1 text-xs font-mono overflow-y-auto max-h-[200px]">
                    {callStack.slice().reverse().map((frame) => ( // Show top of stack at the top
                        <div key={frame.id} className="p-1.5 bg-background rounded-sm shadow-sm border border-border">
                           {frame.name}({frame.params})
                        </div>
                    ))}
                </div>
            </ArenaCanvas>
        </div>
        
        <ArenaControls
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            isPlaying={isPlaying}
            speedValue={speed}
            onSpeedChange={setSpeed}
            canPlay={!isPlaying && steps.length > 0 && (currentStepIndex < steps.length -1 || steps.length === 0)}
            canPause={isPlaying}
            canStep={!isPlaying && steps.length > 0 && currentStepIndex < steps.length -1}
            onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={`${currentDisplayStep.stepTitle || exampleDetails?.label || "Recursion"} Explanation`}
          currentStepExplanation={
             <>
              <p className="text-xs mb-2">{currentDisplayStep.explanation || exampleDetails?.description || 'Select an example.'}</p>
              {!currentDisplayStep.explanation && selectedExample !== 'hanoi' && <p className="text-xs text-muted-foreground italic">Focus on identifying the Base Case and the Recursive Step.</p>}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
