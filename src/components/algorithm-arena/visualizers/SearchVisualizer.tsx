
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
import { Search as SearchIcon, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider'; // Added import for Slider

type SearchAlgorithmType = 'linear' | 'binary';
const SEARCH_ALGORITHMS: { value: SearchAlgorithmType; label: string; description: string, complexity: string }[] = [
  { value: 'linear', label: 'Linear Search', description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.', complexity: 'O(n)' },
  { value: 'binary', label: 'Binary Search', description: 'Efficiently finds an item by repeatedly dividing the search interval in half. Requires a sorted array.', complexity: 'O(log n)' },
];

const INITIAL_SEARCH_ARRAY_SIZE = 15;

function generateSearchArray(size: number, forBinarySearch: boolean): number[] {
  const arr = Array.from({ length: size }, (_, i) => forBinarySearch ? i * 3 + Math.floor(Math.random()*3) : Math.floor(Math.random() * 100) + 1);
  if (forBinarySearch) arr.sort((a, b) => a - b);
  return arr;
}

export default function SearchVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchAlgorithmType>('linear');
  const [arrayData, setArrayData] = useState<number[]>(generateSearchArray(INITIAL_SEARCH_ARRAY_SIZE, false));
  const [arraySize, setArraySize] = useState<number>(INITIAL_SEARCH_ARRAY_SIZE);
  const [targetValue, setTargetValue] = useState<string>('');
  const [parsedTarget, setParsedTarget] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanationPanel, setShowExplanationPanel] = useState<boolean>(true);
  
  const algorithmDetails = SEARCH_ALGORITHMS.find(algo => algo.value === selectedAlgorithm);

  const resetVisualization = useCallback(() => {
    const isBinary = selectedAlgorithm === 'binary';
    setArrayData(generateSearchArray(arraySize, isBinary));
    setIsPlaying(false);
    setExplanation(algorithmDetails?.description || '');
    // Reset search state (e.g., current index, found status)
  }, [arraySize, selectedAlgorithm, algorithmDetails]);

  useEffect(() => {
    resetVisualization();
  }, [selectedAlgorithm, arraySize, resetVisualization]);

  useEffect(() => {
    setExplanation(algorithmDetails?.description || '');
  }, [selectedAlgorithm, algorithmDetails]);
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value as SearchAlgorithmType);
  };
  
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(e.target.value);
    const num = parseInt(e.target.value, 10);
    setParsedTarget(isNaN(num) ? null : num);
  };

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
            <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange}>
              <SelectTrigger id="search-algo-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEARCH_ALGORITHMS.map(algo => <SelectItem key={algo.value} value={algo.value}>{algo.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="target-value-input" className="text-sm font-medium">Target Value</Label>
            <Input id="target-value-input" type="number" value={targetValue} onChange={handleTargetChange} placeholder="e.g., 42" />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="size-slider-search" className="text-sm font-medium whitespace-nowrap">Array Size: {arraySize}</Label>
            <Slider id="size-slider-search" min={5} max={30} step={1} value={[arraySize]} onValueChange={(val) => setArraySize(val[0])} className="w-full"/>
          </div>
        </div>
        
        <ArenaCanvas className="min-h-[150px]">
          <div className="flex items-center justify-center h-full gap-1 p-2" aria-label="Array visualization for searching">
            {arrayData.map((value, index) => (
              <div
                key={index}
                className="bg-primary text-primary-foreground text-xs w-8 h-8 flex items-center justify-center rounded shadow-sm border border-primary/50"
                // Add highlighting for current, matched, discarded elements
              >
                {value}
              </div>
            ))}
          </div>
        </ArenaCanvas>

        <ArenaControls
          onPlay={() => setIsPlaying(true)} // Placeholder
          onPause={() => setIsPlaying(false)} // Placeholder
          onReset={resetVisualization}
          isPlaying={isPlaying}
          onToggleExplanation={() => setShowExplanationPanel(p => !p)}
        />
        <StepByStepExplanation
          isOpen={showExplanationPanel}
          title={algorithmDetails?.label || "Algorithm Explanation"}
          currentStepExplanation={
             <>
              <p className="font-semibold">How it works:</p>
              <p className="text-xs mb-2">{algorithmDetails?.description || 'Select an algorithm.'}</p>
              <p className="font-semibold">Complexity:</p>
              <p className="text-xs">{algorithmDetails?.complexity || '-'}</p>
              {selectedAlgorithm === 'binary' && <p className="text-xs mt-1 text-destructive-foreground/80 bg-destructive/10 p-1 rounded">Note: Binary Search requires the array to be sorted.</p>}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}

