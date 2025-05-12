
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { BarChartHorizontal, RotateCcw } from 'lucide-react';
import type { SortAlgorithmType, SortStep } from '@/types/sort-algorithms'; // Assuming this type will be created

const ALGORITHMS: { value: SortAlgorithmType; label: string; description: string, complexity: string }[] = [
  { value: 'bubble', label: 'Bubble Sort', description: 'Compares adjacent elements and swaps them if they are in the wrong order. Repeats until sorted. Simple but inefficient for large datasets.', complexity: 'O(n²)' },
  { value: 'merge', label: 'Merge Sort', description: 'A divide-and-conquer algorithm. Divides the array into halves, sorts them, and then merges them. Efficient and stable.', complexity: 'O(n log n)' },
  { value: 'quick', label: 'Quick Sort', description: 'Also divide-and-conquer. Picks a pivot, partitions the array around it. Recursively sorts partitions. Generally very fast.', complexity: 'O(n log n) avg, O(n²) worst' },
];

const INITIAL_ARRAY_SIZE = 15;
const MAX_ARRAY_SIZE = 30; // Reduced for better visualization performance on complex sorts
const MIN_ARRAY_SIZE = 5;
const BASE_ANIMATION_DELAY_MS = 500; // Base delay for speed 3

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5); // Values 5-100
}

// --- Sorting Algorithm Logic ---
function bubbleSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [], explanation: "Initial array." });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...localArr], comparing: [j, j + 1], swapping: [], sortedIndices: getSortedSuffix(n, i), explanation: `Comparing elements at index ${j} (${localArr[j]}) and ${j + 1} (${localArr[j+1]}).` });
      if (localArr[j] > localArr[j + 1]) {
        steps.push({ array: [...localArr], comparing: [j, j + 1], swapping: [j,j+1], sortedIndices: getSortedSuffix(n, i), explanation: `Swapping ${localArr[j]} and ${localArr[j+1]}.` });
        [localArr[j], localArr[j + 1]] = [localArr[j + 1], localArr[j]];
        swappedInPass = true;
        steps.push({ array: [...localArr], comparing: [], swapping: [j,j+1], sortedIndices: getSortedSuffix(n, i), explanation: "Elements swapped." });
      }
    }
    if (!swappedInPass) {
        steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: Array.from({length: n}, (_, k) => k), explanation: "Array is sorted (no swaps in last pass)." });
        break; 
    }
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: getSortedSuffix(n, i + 1), explanation: `End of pass ${i + 1}. Element ${localArr[n-i-1]} is in sorted position.` });
  }
  steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: Array.from({length: n}, (_, k) => k), explanation: "Array fully sorted." });
  return steps;
}

function getSortedSuffix(n: number, passesCompleted: number): number[] {
    const sorted = [];
    for (let k = 0; k < passesCompleted; k++) {
        sorted.push(n - 1 - k);
    }
    return sorted;
}

// Placeholder for other sort algorithms - to be implemented
function mergeSortSteps(arr: number[]): SortStep[] { 
    const steps: SortStep[] = [{array: [...arr], comparing: [], swapping: [], sortedIndices: [], explanation: "Merge Sort not yet implemented. Initial array shown."}];
    // Basic merge sort logic generating steps
    // This would involve recursive calls and merging steps visualization
    // For now, just show the final sorted array as a placeholder
    const sortedArr = [...arr].sort((a,b) => a-b);
    steps.push({array: [...sortedArr], comparing: [], swapping: [], sortedIndices: Array.from({length: arr.length}, (_,k)=>k), explanation: "Merge Sort (Placeholder) - Array sorted."});
    return steps;
}
function quickSortSteps(arr: number[]): SortStep[] { 
    const steps: SortStep[] = [{array: [...arr], comparing: [], swapping: [], sortedIndices: [], explanation: "Quick Sort not yet implemented. Initial array shown."}];
    const sortedArr = [...arr].sort((a,b) => a-b);
    steps.push({array: [...sortedArr], comparing: [], swapping: [], sortedIndices: Array.from({length: arr.length}, (_,k)=>k), explanation: "Quick Sort (Placeholder) - Array sorted."});
    return steps;
}


export default function SortVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithmType>('bubble');
  const [arrayData, setArrayData] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(INITIAL_ARRAY_SIZE);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3); // 1-5 (1=fastest, 5=slowest in typical sliders, but we'll invert for delay)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const algorithmDetails = ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const generateAndSetSteps = useCallback(() => {
    let steps: SortStep[];
    switch (selectedAlgorithm) {
      case 'bubble':
        steps = bubbleSortSteps([...arrayData]);
        break;
      case 'merge':
        steps = mergeSortSteps([...arrayData]); // Placeholder
        break;
      case 'quick':
        steps = quickSortSteps([...arrayData]); // Placeholder
        break;
      default:
        steps = [{ array: [...arrayData], comparing: [], swapping: [], sortedIndices: [], explanation: "Select an algorithm." }];
    }
    setSortSteps(steps);
    setCurrentStepIndex(0);
  }, [selectedAlgorithm, arrayData]);

  const resetArrayAndSteps = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArrayData(newArray);
    // Steps will be regenerated by useEffect watching arrayData and selectedAlgorithm
  }, [arraySize]);

  useEffect(() => {
    resetArrayAndSteps();
  }, [selectedAlgorithm, arraySize, resetArrayAndSteps]);

  useEffect(() => {
    if (arrayData.length > 0) {
        generateAndSetSteps();
    }
  }, [arrayData, selectedAlgorithm, generateAndSetSteps]);
  

  useEffect(() => {
    if (isPlaying && currentStepIndex < sortSteps.length - 1) {
      // Speed 1 = fastest (short delay), Speed 5 = slowest (long delay)
      const delay = BASE_ANIMATION_DELAY_MS / speed; 
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (isPlaying && currentStepIndex >= sortSteps.length - 1) {
      setIsPlaying(false); // Stop playing at the end
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, sortSteps.length, speed]);


  const handlePlay = () => {
    if (currentStepIndex >= sortSteps.length - 1) { // If at end, reset and play
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (currentStepIndex < sortSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
     setIsPlaying(false); // Pause if stepping manually
  };
  const handleReset = () => {
    setIsPlaying(false);
    resetArrayAndSteps(); // This will also set currentStepIndex to 0 via generateAndSetSteps
  };
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as AlgorithmType);
    // State reset will be handled by useEffects
  };

  const handleSizeChange = (value: number[]) => {
    setArraySize(value[0]);
     // State reset will be handled by useEffects
  };
  
  const handleSpeedChange = (value: number) => {
    setSpeed(value);
  };

  const currentDisplayStep = sortSteps[currentStepIndex] || { array: arrayData, comparing: [], swapping: [], sortedIndices: [], explanation: "Initializing..." };
  const currentArrayToDisplay = currentDisplayStep.array;


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChartHorizontal className="w-7 h-7 text-primary" /> Sorting Algorithm Visualizer
        </CardTitle>
        <CardDescription>Watch sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort in action.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="algorithm-select" className="text-sm font-medium">Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange} disabled={isPlaying}>
              <SelectTrigger id="algorithm-select">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map(algo => (
                  <SelectItem key={algo.value} value={algo.value}>{algo.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='col-span-1 md:col-span-2'>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="size-slider" className="text-sm font-medium">Array Size: {arraySize}</Label>
               <Button onClick={handleReset} variant="outline" size="sm" disabled={isPlaying}>
                <RotateCcw className="mr-2 h-4 w-4" /> Regenerate Array
              </Button>
            </div>
            <Slider
              id="size-slider"
              min={MIN_ARRAY_SIZE}
              max={MAX_ARRAY_SIZE}
              step={1}
              value={[arraySize]}
              onValueChange={handleSizeChange}
              disabled={isPlaying}
            />
          </div>
        </div>

        <ArenaCanvas className="min-h-[300px] !bg-background"> {/* Ensure canvas background allows bar visibility */}
          <div className="flex items-end justify-center h-full gap-0.5 px-2 overflow-hidden" aria-label="Array visualization">
            {currentArrayToDisplay.map((value, index) => {
              const isComparing = currentDisplayStep.comparing?.includes(index);
              const isSwapping = currentDisplayStep.swapping?.includes(index);
              const isSorted = currentDisplayStep.sortedIndices?.includes(index);
              
              let barColorClass = 'bg-primary'; // Default
              if (isSorted) barColorClass = 'bg-green-500'; // Sorted
              if (isSwapping) barColorClass = 'bg-red-500 animate-pulse'; // Swapping
              else if (isComparing) barColorClass = 'bg-yellow-500'; // Comparing

              return (
                <div
                  key={index}
                  className={`transition-all duration-100 ease-in-out rounded-t-sm ${barColorClass}`}
                  style={{ 
                    height: `${(value / 105) * 100}%`, // Max value 100, allow slight overflow for 100 to show
                    width: `${Math.max(1, 100 / currentArrayToDisplay.length - 1)}%` // Ensure some width even for many bars
                  }}
                  title={`Value: ${value}, Index: ${index}`}
                ></div>
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
          canPlay={!isPlaying && (sortSteps.length > 0 && currentStepIndex < sortSteps.length -1)}
          canPause={isPlaying}
          canStep={!isPlaying && (sortSteps.length > 0 && currentStepIndex < sortSteps.length -1)}
          onToggleExplanation={() => setShowExplanationPanel(prev => !prev)}
        />

        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={algorithmDetails?.label || "Algorithm Explanation"}
          currentStepExplanation={
            <>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="font-semibold">How it works:</p>
                <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm.'}</p>
                <p className="font-semibold">Complexity:</p>
                <p className="text-xs">{algorithmDetails?.complexity || '-'}</p>
              </div>
              {currentDisplayStep.explanation && (
                <p className="mt-2 pt-2 border-t text-accent-foreground/80 text-xs">Current Action: {currentDisplayStep.explanation}</p>
              )}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
