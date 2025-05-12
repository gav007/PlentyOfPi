
export type SearchAlgorithmType = 'linear' | 'binary';

export interface SearchStep {
  currentIndex?: number | null; // For linear search or mid in binary
  low?: number | null;          // For binary search's lower bound
  high?: number | null;         // For binary search's upper bound
  mid?: number | null;          // For binary search's middle index
  foundIndex?: number | null;   // Index where target is found
  discardedBefore?: number;     // Index: elements *before* this are discarded (binary search)
  discardedAfter?: number;      // Index: elements *after* this (from end) are discarded (binary search)
  explanation: string;
  isFound?: boolean;            // True if target found at this step
  searchComplete?: boolean;     // True if search is over (found or not found)
  message?: string;             // Final message for found/not found
}
