
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ArenaCanvas from '@/components/algorithm-arena/shared/ArenaCanvas';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls';
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation';
import { BarChartHorizontal, RotateCcw, Play, Pause, SkipForward, SlidersHorizontal } from 'lucide-react';

type AlgorithmType = 'bubble' | 'merge' | 'quick';
const ALGORITHMS: { value: AlgorithmType; label: string; description: string, complexity: string }[] = [
  { value: 'bubble', label: 'Bubble Sort', description: 'Compares adjacent elements and swaps them if they are in the wrong order. Repeats until sorted. Simple but inefficient for large datasets.', complexity: 'O(n²)' },
  { value: 'merge', label: 'Merge Sort', description: 'A divide-and-conquer algorithm. Divides the array into halves, sorts them, and then merges them. Efficient and stable.', complexity: 'O(n log n)' },
  { value: 'quick', label: 'Quick Sort', description: 'Also divide-and-conquer. Picks a pivot, partitions the array around it. Recursively sorts partitions. Generally very fast.', complexity: 'O(n log n) avg, O(n²) worst' },
];

const INITIAL_ARRAY_SIZE = 15;
const MAX_ARRAY_SIZE = 50;
const MIN_ARRAY_SIZE = 5;

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
}

export default function SortVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bubble');
  const [arrayData, setArrayData] = useState<number[]>(generateRandomArray(INITIAL_ARRAY_SIZE));
  const [arraySize, setArraySize] = useState<number>(INITIAL_ARRAY_SIZE);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3); // 1-5
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sortSteps, setSortSteps] = useState<any[]>([]); // Placeholder for algorithm steps
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);

  const algorithmDetails = ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const resetArray = useCallback(() => {
    setArrayData(generateRandomArray(arraySize));
    setIsPlaying(false);
    setCurrentStep(0);
    setSortSteps([]);
    setExplanation(algorithmDetails?.description || '');
  }, [arraySize, algorithmDetails]);

  useEffect(() => {
    resetArray();
  }, [selectedAlgorithm, arraySize, resetArray]);
  
  useEffect(() => {
    setExplanation(algorithmDetails?.description || '');
  }, [selectedAlgorithm, algorithmDetails]);


  const handlePlay = () => setIsPlaying(true); // Placeholder
  const handlePause = () => setIsPlaying(false); // Placeholder
  const handleStep = () => { /* Placeholder: advance one step in sortSteps */ };
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as AlgorithmType);
  };

  const handleSizeChange = (value: number[]) => {
    setArraySize(value[0]);
  };
  
  const handleSpeedChange = (value: number) => {
    setSpeed(value);
  };

  // In a real implementation, changing selectedAlgorithm or arrayData would trigger step generation.
  // const steps = generateSortSteps(arrayData, selectedAlgorithm); setSortSteps(steps);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChartHorizontal className="w-7 h-7 text-primary" /> Sorting Algorithm Visualizer
        </CardTitle>
        <CardDescription>Watch sorting algorithms like Bubble Sort and Merge Sort in action.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-muted/50 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="algorithm-select" className="text-sm font-medium">Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange}>
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
               <Button onClick={resetArray} variant="outline" size="sm">
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
            />
          </div>
        </div>

        <ArenaCanvas className="min-h-[300px]">
          <div className="flex items-end justify-center h-full gap-0.5 px-2" aria-label="Array visualization">
            {arrayData.map((value, index) => (
              <div
                key={index}
                className="bg-primary transition-all duration-150 ease-in-out" // Add comparison/swap classes later
                style={{ height: `${(value / 105) * 100}%`, width: `${100 / arrayData.length}%` }}
                title={`Value: ${value}`}
              ></div>
            ))}
          </div>
        </ArenaCanvas>

        <ArenaControls
          onPlay={handlePlay}
          onPause={handlePause}
          onStep={handleStep}
          onReset={resetArray}
          isPlaying={isPlaying}
          speedValue={speed}
          onSpeedChange={handleSpeedChange}
          onToggleExplanation={() => setShowExplanationPanel(prev => !prev)}
        />

        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={algorithmDetails?.label || "Algorithm Explanation"}
          currentStepExplanation={
            <>
              <p className="font-semibold">How it works:</p>
              <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm to see its details.'}</p>
              <p className="font-semibold">Complexity:</p>
              <p className="text-xs">{algorithmDetails?.complexity || '-'}</p>
              {/* Current step explanation would go here if sortSteps were implemented */}
              {sortSteps.length > 0 && currentStep < sortSteps.length && (
                <p className="mt-2 pt-2 border-t text-accent-foreground/80">Current Action: {sortSteps[currentStep]?.explanation || "N/A"}</p>
              )}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
