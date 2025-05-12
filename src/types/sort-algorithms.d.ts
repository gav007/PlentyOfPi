
export type SortAlgorithmType = 'bubble' | 'merge' | 'quick' | 'selection' | 'insertion';

export interface SortStep {
  array: number[];            // Current state of the array
  comparing?: number[];       // Indices of elements being compared
  swapping?: number[];        // Indices of elements being swapped (or moved)
  sortedIndices?: number[];   // Indices of elements that are in their final sorted position
  pivot?: number;             // Index of the pivot (for Quick Sort)
  subArrayBounds?: [number, number]; // Bounds of subarray being processed (for Merge Sort, Quick Sort)
  explanation: string;        // Textual description of the current step
}
