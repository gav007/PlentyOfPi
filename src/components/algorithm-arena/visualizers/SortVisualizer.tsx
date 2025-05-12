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
import ComplexityDisplay from '@/components/algorithm-arena/shared/ComplexityDisplay';
import { BarChartHorizontal, RotateCcw } from 'lucide-react';
import type { SortAlgorithmType, SortStep } from '@/types/sort-algorithms';
import { cn } from '@/lib/utils';

const ALGORITHMS: { value: SortAlgorithmType; label: string; description: string, timeComplexity: string, spaceComplexity: string }[] = [
  { value: 'bubble', label: 'Bubble Sort', description: 'Compares adjacent elements and swaps them if they are in the wrong order. Repeats until sorted. Simple but inefficient for large datasets.', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  { value: 'merge', label: 'Merge Sort', description: 'A divide-and-conquer algorithm. Divides the array into halves, sorts them, and then merges them. Efficient and stable.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { value: 'quick', label: 'Quick Sort', description: 'Also divide-and-conquer. Picks a pivot, partitions the array around it. Recursively sorts partitions. Generally very fast.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)' },
];

const INITIAL_ARRAY_SIZE = 15;
const MAX_ARRAY_SIZE = 30;
const MIN_ARRAY_SIZE = 5;
const BASE_ANIMATION_DELAY_MS = 600;

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function bubbleSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  let sortedIndices: number[] = [];

  steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [...sortedIndices], explanation: "Initial array state." });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [...sortedIndices], explanation: `Starting pass ${i + 1}. Largest unsorted elements will "bubble" to the end.` });
    
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ array: [...localArr], comparing: [j, j + 1], swapping: [], sortedIndices: [...sortedIndices], explanation: `Comparing elements at index ${j} (${localArr[j]}) and ${j + 1} (${localArr[j+1]}).` });
      if (localArr[j] > localArr[j + 1]) {
        steps.push({ array: [...localArr], comparing: [j, j + 1], swapping: [j,j+1], sortedIndices: [...sortedIndices], explanation: `${localArr[j]} > ${localArr[j+1]}. Swapping.` });
        [localArr[j], localArr[j + 1]] = [localArr[j + 1], localArr[j]];
        swappedInPass = true;
        steps.push({ array: [...localArr], comparing: [], swapping: [j,j+1], sortedIndices: [...sortedIndices], explanation: `Elements at indices ${j} and ${j+1} swapped. Array: [${localArr.join(', ')}]` });
      } else {
         steps.push({ array: [...localArr], comparing: [j, j + 1], swapping: [], sortedIndices: [...sortedIndices], explanation: `${localArr[j]} <= ${localArr[j+1]}. No swap.` });
      }
    }
    sortedIndices.unshift(n - 1 - i); 
    sortedIndices.sort((a, b) => a - b); 

    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [...sortedIndices], explanation: `End of pass ${i + 1}. Element ${localArr[n-1-i]} is now in its sorted position.` });
    
    if (!swappedInPass) {
      const remainingUnsortedIndices = Array.from({length: n - sortedIndices.length}, (_, k) => {
        // Find indices not yet in sortedIndices
        let current = 0;
        while(sortedIndices.includes(current) || remainingUnsortedIndices.includes(current)){
            current++;
        }
        return current;
      }).filter(idx => idx < n); // Ensure indices are within bounds
      sortedIndices = [...new Set([...sortedIndices, ...remainingUnsortedIndices])].sort((a,b) => a-b);
      steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [...sortedIndices], explanation: "No swaps in the last pass. Array is sorted." });
      break; 
    }
  }
  if (sortedIndices.length < n) {
    sortedIndices = Array.from({length: n}, (_, k) => k);
  }
  steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [...sortedIndices], explanation: "Array fully sorted." });
  return steps;
}


function mergeSortSteps(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let localArr = [...arr];
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [], explanation: "Initial array for Merge Sort." });

    function merge(left: number[], right: number[], originalStartIndex: number): number[] {
        let resultArray: number[] = [], leftIndex = 0, rightIndex = 0;
        let currentComparison: number[] = [];
        
        // For visualization: combine indices relative to original array
        const mapToOriginalIndices = (subArrayIndices: number[], baseIndex: number) => subArrayIndices.map(idx => idx + baseIndex);

        while (leftIndex < left.length && rightIndex < right.length) {
            currentComparison = [originalStartIndex + leftIndex, originalStartIndex + left.length + rightIndex];
            steps.push({ 
                array: [...localArr], // Show current state of full array
                comparing: currentComparison, 
                swapping: [], // Swapping is implicit in merge
                sortedIndices: [], // Not final yet
                subArrayBounds: [originalStartIndex, originalStartIndex + left.length + right.length -1],
                explanation: `Merging: Comparing L[${leftIndex}] (${left[leftIndex]}) and R[${rightIndex}] (${right[rightIndex]})`
            });

            if (left[leftIndex] < right[rightIndex]) {
                resultArray.push(left[leftIndex]);
                leftIndex++;
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++;
            }
        }
        
        const mergedPortion = resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        
        // Update localArr with the merged portion for visualization
        for(let i = 0; i < mergedPortion.length; i++) {
            localArr[originalStartIndex + i] = mergedPortion[i];
        }
        
        steps.push({ 
            array: [...localArr], 
            comparing: [], 
            swapping: mapToOriginalIndices(Array.from({length: mergedPortion.length}, (_,k)=>k), originalStartIndex), // Highlight merged part
            sortedIndices: [], 
            subArrayBounds: [originalStartIndex, originalStartIndex + mergedPortion.length -1],
            explanation: `Merged subarray from index ${originalStartIndex} to ${originalStartIndex + mergedPortion.length -1}. Content: [${mergedPortion.join(', ')}]`
        });
        return mergedPortion;
    }

    function mergeSortRecursive(arrayToSort: number[], startIndexInFullArray: number): number[] {
        if (arrayToSort.length <= 1) {
            steps.push({ 
                array: [...localArr], 
                comparing: [], 
                swapping: [], 
                sortedIndices: mapToOriginalIndices(Array.from({length: arrayToSort.length}, (_,k)=>k), startIndexInFullArray), // Mark as "sorted" sub-portion
                subArrayBounds: [startIndexInFullArray, startIndexInFullArray + arrayToSort.length -1],
                explanation: `Base case: Subarray [${arrayToSort.join(', ')}] (at original index ${startIndexInFullArray}) is considered sorted.`
            });
            return arrayToSort;
        }
        const middle = Math.floor(arrayToSort.length / 2);
        const leftHalf = arrayToSort.slice(0, middle);
        const rightHalf = arrayToSort.slice(middle);

        steps.push({ 
            array: [...localArr], 
            comparing: [], 
            swapping: [], 
            sortedIndices: [], 
            subArrayBounds: [startIndexInFullArray, startIndexInFullArray + arrayToSort.length -1],
            explanation: `Dividing subarray at original index ${startIndexInFullArray}: Left [${leftHalf.join(', ')}], Right [${rightHalf.join(', ')}]`
        });

        const sortedLeft = mergeSortRecursive(leftHalf, startIndexInFullArray);
        const sortedRight = mergeSortRecursive(rightHalf, startIndexInFullArray + middle);
        
        return merge(sortedLeft, sortedRight, startIndexInFullArray);
    }

    mergeSortRecursive(localArr, 0);
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: Array.from({length: arr.length}, (_,k)=>k), explanation: "Merge Sort complete. Array fully sorted."});
    return steps;
}

function quickSortSteps(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let localArr = [...arr];
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: [], explanation: "Initial array for Quick Sort." });

    function partition(array: number[], low: number, high: number): number {
        const pivotValue = array[high];
        let i = low - 1; 
        steps.push({
            array: [...localArr],
            comparing: [],
            swapping: [],
            pivot: high,
            subArrayBounds: [low, high],
            explanation: `Partitioning subarray from index ${low} to ${high}. Pivot is ${pivotValue} (at index ${high}).`
        });

        for (let j = low; j < high; j++) {
            steps.push({ array: [...localArr], comparing: [j, high], swapping: [], pivot: high, subArrayBounds: [low, high], explanation: `Comparing element ${array[j]} with pivot ${pivotValue}.` });
            if (array[j] < pivotValue) {
                i++;
                steps.push({ array: [...localArr], comparing: [j, high], swapping: [i,j], pivot: high, subArrayBounds: [low, high], explanation: `${array[j]} < ${pivotValue}. Swapping ${array[i]} (at index ${i}) with ${array[j]} (at index ${j}).` });
                [array[i], array[j]] = [array[j], array[i]];
                [localArr[i], localArr[j]] = [localArr[j], localArr[i]]; // Keep localArr in sync for full array visualization
                 steps.push({ array: [...localArr], comparing: [], swapping: [i,j], pivot: high, subArrayBounds: [low, high], explanation: `Elements swapped.` });
            }
        }
        steps.push({ array: [...localArr], comparing: [], swapping: [i+1, high], pivot: high, subArrayBounds: [low, high], explanation: `Placing pivot ${pivotValue}. Swapping ${array[i+1]} (at index ${i+1}) with pivot ${array[high]} (at index ${high}).` });
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        [localArr[i+1], localArr[high]] = [localArr[high], localArr[i+1]];
        
        const pivotFinalIndex = i + 1;
        steps.push({ 
            array: [...localArr], 
            comparing: [], 
            swapping: [], 
            sortedIndices: [pivotFinalIndex], // Pivot is now in sorted position for this partition
            pivot: pivotFinalIndex, 
            subArrayBounds: [low, high],
            explanation: `Pivot ${pivotValue} is now at its sorted position: index ${pivotFinalIndex}.` 
        });
        return pivotFinalIndex;
    }

    function quickSortRecursive(array: number[], low: number, high: number) {
        if (low < high) {
            const pi = partition(array, low, high);
            steps.push({ array: [...localArr], comparing: [], swapping: [], pivot: pi, subArrayBounds: [low, high], explanation: `Pivot placed. Recursively sorting left and right partitions.`});
            quickSortRecursive(array, low, pi - 1);
            quickSortRecursive(array, pi + 1, high);
        } else if (low === high) { // Single element partition is sorted
             steps.push({ 
                array: [...localArr], 
                comparing: [], 
                swapping: [], 
                sortedIndices: [low],
                subArrayBounds: [low, high],
                explanation: `Subarray of size 1 at index ${low} is sorted.`
            });
        }
    }
    
    quickSortRecursive(localArr, 0, localArr.length - 1);

    // After recursion, mark all as sorted
    const finalSortedIndices = Array.from({length: localArr.length}, (_, k) => k);
    steps.push({ array: [...localArr], comparing: [], swapping: [], sortedIndices: finalSortedIndices, explanation: "Quick Sort complete. Array fully sorted."});
    return steps;
}


export default function SortVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithmType>('bubble');
  const [arrayData, setArrayData] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(INITIAL_ARRAY_SIZE);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);

  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const algorithmDetails = ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const generateAndSetSteps = useCallback(() => {
    if (!arrayData || arrayData.length === 0) return;
    let steps: SortStep[];
    switch (selectedAlgorithm) {
      case 'bubble':
        steps = bubbleSortSteps([...arrayData]);
        break;
      case 'merge':
        steps = mergeSortSteps([...arrayData]);
        break;
      case 'quick':
        steps = quickSortSteps([...arrayData]);
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
  }, [arraySize]);

  useEffect(() => {
    resetArrayAndSteps();
  }, [arraySize, resetArrayAndSteps]);

  useEffect(() => {
    if (arrayData.length > 0) {
        generateAndSetSteps();
    }
  }, [arrayData, selectedAlgorithm, generateAndSetSteps]);


  useEffect(() => {
    if (isPlaying && currentStepIndex < sortSteps.length - 1) {
      const delay = BASE_ANIMATION_DELAY_MS / speed;
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (isPlaying && currentStepIndex >= sortSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, sortSteps.length, speed]);


  const handlePlay = () => {
    if (currentStepIndex >= sortSteps.length - 1 && sortSteps.length > 0) {
      generateAndSetSteps(); 
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (currentStepIndex < sortSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
     setIsPlaying(false);
  };
  const handleReset = () => {
    setIsPlaying(false);
    resetArrayAndSteps(); 
  };

  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as SortAlgorithmType);
  };

  const handleSizeChange = (value: number[]) => {
    setArraySize(value[0]);
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
               <Button onClick={handleReset} variant="outline" size="sm" disabled={isPlaying} className="px-2 py-1 h-auto text-xs">
                <RotateCcw className="mr-1 h-3 w-3" /> Regenerate Array
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
              className="w-full"
            />
          </div>
        </div>

        <ArenaCanvas className="min-h-[300px]">
          <div className="flex items-end justify-center h-full gap-0.5 px-2 overflow-hidden" aria-label="Array visualization">
            {currentArrayToDisplay.map((value, index) => {
              const isComparing = currentDisplayStep.comparing?.includes(index);
              const isSwapping = currentDisplayStep.swapping?.includes(index);
              const isSorted = currentDisplayStep.sortedIndices?.includes(index);
              const isPivot = currentDisplayStep.pivot === index;
              
              let barColorClass = 'bg-primary/70'; // Default bar color

              if(currentDisplayStep.subArrayBounds) {
                 if(index >= currentDisplayStep.subArrayBounds[0] && index <= currentDisplayStep.subArrayBounds[1]) {
                    barColorClass = 'bg-accent/70'; // Color for elements in current subarray
                 } else {
                    barColorClass = 'bg-muted-foreground/30'; // Dim elements outside current subarray focus
                 }
              }

              if (isPivot) barColorClass = 'bg-purple-500'; // Pivot color
              if (isComparing) barColorClass = 'bg-yellow-400'; // Comparing color
              if (isSwapping) barColorClass = 'bg-red-500 animate-pulse'; // Swapping color
              if (isSorted) barColorClass = 'bg-green-500/80'; // Sorted color
              

              return (
                <div
                  key={index}
                  className={cn(
                    "transition-all duration-150 ease-in-out rounded-t-sm",
                    barColorClass
                  )}
                  style={{
                    height: `${Math.max(5, (value / 105) * 100)}%`, 
                    width: `${Math.max(1, 100 / currentArrayToDisplay.length - 1)}%`
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
          canPlay={!isPlaying && (sortSteps.length > 0 && (currentStepIndex < sortSteps.length -1 || sortSteps.length === 0))}
          canPause={isPlaying}
          canStep={!isPlaying && (sortSteps.length > 0 && currentStepIndex < sortSteps.length -1)}
          onToggleExplanation={() => setShowExplanationPanel(prev => !prev)}
        />

        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={`${algorithmDetails?.label || "Algorithm"} Explanation`}
          currentStepExplanation={
            <>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="font-semibold">How it works:</p>
                <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm.'}</p>

                {algorithmDetails && (
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <ComplexityDisplay complexity={algorithmDetails.timeComplexity} type="Time" />
                    <ComplexityDisplay complexity={algorithmDetails.spaceComplexity} type="Space" />
                  </div>
                )}
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