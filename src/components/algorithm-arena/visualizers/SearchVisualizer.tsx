
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { Search as SearchIcon, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type SearchAlgorithmType = 'linear' | 'binary';
const SEARCH_ALGORITHMS: { value: SearchAlgorithmType; label: string; description: string, complexity: string, note?: string }[] = [
  { value: 'linear', label: 'Linear Search', description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.', complexity: 'O(n)' },
  { value: 'binary', label: 'Binary Search', description: 'Efficiently finds an item by repeatedly dividing the search interval in half. Requires a sorted array.', complexity: 'O(log n)', note: 'Binary Search requires the array to be sorted.' },
];

interface SearchStep {
  currentIndex?: number | null;
  low?: number | null;
  high?: number | null;
  mid?: number | null;
  foundIndex?: number | null;
  discardedBefore?: number; // Elements discarded from the start
  discardedAfter?: number; // Elements discarded from the end
  explanation: string;
  isFound?: boolean;
  searchComplete?: boolean;
  message?: string; // For found/not found messages
}

const INITIAL_ARRAY_SIZE = 15;
const MIN_ARRAY_SIZE = 5;
const MAX_ARRAY_SIZE = 30;
const BASE_ANIMATION_DELAY_MS = 700;


function generateSearchArray(size: number, forBinarySearch: boolean): number[] {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10); // Values 10-99
  if (forBinarySearch) {
    arr.sort((a, b) => a - b);
  }
  return arr;
}

// --- Algorithm Logic ---
function linearSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  steps.push({ explanation: `Starting Linear Search for target ${target}.` });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ currentIndex: i, explanation: `Checking element at index ${i} (value: ${arr[i]}).` });
    if (arr[i] === target) {
      steps.push({ foundIndex: i, explanation: `Target ${target} found at index ${i}.`, isFound: true, searchComplete: true, message: `Found ${target} at index ${i}!` });
      return steps;
    }
  }
  steps.push({ explanation: `Target ${target} not found in the array.`, searchComplete: true, message: `Target ${target} not found.` });
  return steps;
}

function binarySearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let low = 0;
  let high = arr.length - 1;
  steps.push({ low, high, explanation: `Starting Binary Search for target ${target}. Array is sorted. Initial range: [${low}, ${high}].` });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ low, high, mid, discardedBefore: low, discardedAfter: arr.length -1 - high, explanation: `Checking middle element at index ${mid} (value: ${arr[mid]}). Current range [${low}, ${high}].` });
    if (arr[mid] === target) {
      steps.push({ low, high, mid, foundIndex: mid, explanation: `Target ${target} found at index ${mid}.`, isFound: true, searchComplete: true, message: `Found ${target} at index ${mid}!` });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ low, high, mid, explanation: `${arr[mid]} < ${target}. Discarding left half. New range will be [${mid + 1}, ${high}].` });
      low = mid + 1;
    } else {
      steps.push({ low, high, mid, explanation: `${arr[mid]} > ${target}. Discarding right half. New range will be [${low}, ${mid - 1}].` });
      high = mid - 1;
    }
    steps.push({ low, high, discardedBefore: low, discardedAfter: arr.length - 1 - high, explanation: `Updated search range to [${low}, ${high}].` });
  }
  steps.push({ low, high, explanation: `Target ${target} not found in the array. Search range [${low}, ${high}] became invalid.`, searchComplete: true, message: `Target ${target} not found.` });
  return steps;
}


export default function SearchVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchAlgorithmType>('linear');
  const [arrayData, setArrayData] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(INITIAL_ARRAY_SIZE);
  const [targetValue, setTargetValue] = useState<string>('');
  const [parsedTarget, setParsedTarget] = useState<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const algorithmDetails = SEARCH_ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const generateAndSetSteps = useCallback(() => {
    if (!parsedTarget) {
        setSearchSteps([{ explanation: "Please enter a valid target value to search.", searchComplete: true, message: "Enter target." }]);
        setCurrentStepIndex(0);
        return;
    }
    let steps: SearchStep[];
    switch (selectedAlgorithm) {
      case 'linear':
        steps = linearSearchSteps([...arrayData], parsedTarget);
        break;
      case 'binary':
        steps = binarySearchSteps([...arrayData], parsedTarget); // Array is already sorted by generateSearchArray
        break;
      default:
        steps = [{ explanation: "Select an algorithm.", searchComplete: true, message: "Algorithm?" }];
    }
    setSearchSteps(steps);
    setCurrentStepIndex(0);
  }, [selectedAlgorithm, arrayData, parsedTarget]);

  const resetArrayAndSteps = useCallback(() => {
    const isBinary = selectedAlgorithm === 'binary';
    setArrayData(generateSearchArray(arraySize, isBinary));
  }, [arraySize, selectedAlgorithm]);

  useEffect(() => {
    resetArrayAndSteps();
  }, [selectedAlgorithm, arraySize, resetArrayAndSteps]);

  useEffect(() => {
    if(arrayData.length > 0) { // Only generate steps if arrayData is populated
        generateAndSetSteps();
    }
  }, [arrayData, selectedAlgorithm, generateAndSetSteps, parsedTarget]);
  

  useEffect(() => {
    if (isPlaying && currentStepIndex < searchSteps.length - 1) {
      const delay = BASE_ANIMATION_DELAY_MS / speed; 
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (isPlaying && currentStepIndex >= searchSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, searchSteps.length, speed]);


  const handlePlay = () => {
    if (!parsedTarget) {
      setSearchSteps([{ explanation: "Please enter a target value first.", searchComplete: true, message: "Missing target!" }]);
      setCurrentStepIndex(0);
      return;
    }
    if (currentStepIndex >= searchSteps.length - 1) {
      generateAndSetSteps(); // Regenerate steps which also resets index to 0
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (!parsedTarget) {
      setSearchSteps([{ explanation: "Please enter a target value first.", searchComplete: true, message: "Missing target!" }]);
      setCurrentStepIndex(0);
      return;
    }
    if (currentStepIndex < searchSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
     setIsPlaying(false);
  };
  const handleReset = () => {
    setIsPlaying(false);
    resetArrayAndSteps(); // This will also trigger step regeneration
    // No need to set targetValue/parsedTarget to empty if user wants to search same target in new array
  };
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as SearchAlgorithmType);
  };
  
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(e.target.value);
    const num = parseInt(e.target.value, 10);
    setParsedTarget(isNaN(num) ? null : num);
  };
  
  const handleSizeChange = (value: number[]) => {
    setArraySize(value[0]);
  };
  
  const handleSpeedChange = (value: number) => {
    setSpeed(value);
  };

  const currentDisplayStep = searchSteps[currentStepIndex] || { explanation: "Initializing..." };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <SearchIcon className="w-7 h-7 text-primary"/> Searching Algorithm Visualizer
        </CardTitle>
        <CardDescription>Visualize Linear Search and Binary Search step-by-step.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="search-algo-select" className="text-sm font-medium">Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange} disabled={isPlaying}>
              <SelectTrigger id="search-algo-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEARCH_ALGORITHMS.map(algo => <SelectItem key={algo.value} value={algo.value}>{algo.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="target-value-input" className="text-sm font-medium">Target Value</Label>
            <Input id="target-value-input" type="number" value={targetValue} onChange={handleTargetChange} placeholder="e.g., 42" disabled={isPlaying}/>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <Label htmlFor="size-slider-search" className="text-sm font-medium whitespace-nowrap">Array Size: {arraySize}</Label>
                <Button onClick={handleReset} variant="outline" size="sm" disabled={isPlaying} className="px-2 py-1 h-auto text-xs">
                    <RotateCcw className="mr-1 h-3 w-3" /> Regenerate
                </Button>
            </div>
            <Slider id="size-slider-search" min={MIN_ARRAY_SIZE} max={MAX_ARRAY_SIZE} step={1} value={[arraySize]} onValueChange={handleSizeChange} disabled={isPlaying} className="w-full"/>
          </div>
        </div>
        
        <ArenaCanvas className="min-h-[100px] md:min-h-[150px]">
          <div className="flex flex-wrap items-center justify-center h-full gap-1 p-2" aria-label="Array visualization for searching">
            {arrayData.map((value, index) => {
              let bgColor = 'bg-secondary text-secondary-foreground'; // Default
              let isDiscarded = false;

              if (selectedAlgorithm === 'binary') {
                if (currentDisplayStep.discardedBefore !== undefined && index < currentDisplayStep.discardedBefore) isDiscarded = true;
                if (currentDisplayStep.discardedAfter !== undefined && index > (arrayData.length - 1 - currentDisplayStep.discardedAfter)) isDiscarded = true;
              }

              if (currentDisplayStep.foundIndex === index) {
                bgColor = 'bg-green-500 text-green-foreground'; // Found
              } else if (
                (selectedAlgorithm === 'linear' && currentDisplayStep.currentIndex === index) ||
                (selectedAlgorithm === 'binary' && currentDisplayStep.mid === index)
                ) {
                bgColor = 'bg-yellow-400 text-yellow-foreground'; // Currently checking
              } else if (isDiscarded) {
                bgColor = 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 opacity-50'; // Discarded
              } else if (selectedAlgorithm === 'binary') {
                if ((currentDisplayStep.low !== undefined && index >= currentDisplayStep.low) && 
                    (currentDisplayStep.high !== undefined && index <= currentDisplayStep.high)) {
                   bgColor = 'bg-blue-300/70 text-blue-foreground'; // Active search range for binary
                }
              }


              return (
                <div
                  key={index}
                  className={cn(
                    "text-xs w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded shadow-sm border transition-all duration-150",
                    bgColor,
                    currentDisplayStep.foundIndex === index && "ring-2 ring-green-600 scale-110",
                    ((selectedAlgorithm === 'linear' && currentDisplayStep.currentIndex === index) ||
                    (selectedAlgorithm === 'binary' && currentDisplayStep.mid === index)) && !currentDisplayStep.foundIndex && "ring-2 ring-yellow-500 scale-105"
                  )}
                  title={`Index: ${index}, Value: ${value}`}
                >
                  {value}
                </div>
              );
            })}
          </div>
        </ArenaCanvas>

        <ArenaControls
          onPlay={handlePlay}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          isPlaying={isPlaying}
          speedValue={speed}
          onSpeedChange={handleSpeedChange}
          canPlay={!isPlaying && (searchSteps.length > 0 && currentStepIndex < searchSteps.length -1) && !!parsedTarget}
          canPause={isPlaying}
          canStep={!isPlaying && (searchSteps.length > 0 && currentStepIndex < searchSteps.length -1) && !!parsedTarget}
          onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={currentDisplayStep.searchComplete ? (currentDisplayStep.isFound ? "Target Found!" : "Target Not Found") : (algorithmDetails?.label || "Algorithm Explanation")}
          currentStepExplanation={
             <>
              {currentDisplayStep.searchComplete && currentDisplayStep.message && (
                <p className={cn("font-semibold mb-2", currentDisplayStep.isFound ? "text-green-600" : "text-destructive")}>
                  {currentDisplayStep.message}
                </p>
              )}
              <p className="text-xs mb-2">{currentDisplayStep.explanation || algorithmDetails?.description || 'Select an algorithm and target.'}</p>
              {!currentDisplayStep.searchComplete && algorithmDetails?.complexity && (
                 <>
                    <p className="font-semibold text-xs">Complexity:</p>
                    <p className="text-xs mb-1">{algorithmDetails.complexity}</p>
                 </>
              )}
              {algorithmDetails?.note && <p className="text-xs mt-1 text-muted-foreground/80 p-1 rounded">{algorithmDetails.note}</p>}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}

