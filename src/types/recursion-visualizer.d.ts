
export interface CallStackFrame {
  id: string; // Unique ID for the call frame, useful for keying in React
  name: string; // Function name, e.g., "factorial"
  params: string; // String representation of parameters, e.g., "5"
}

export interface HanoiPegsState {
  A: number[];
  B: number[];
  C: number[];
}

export interface HanoiMove {
  disk: number;
  fromPeg: string;
  toPeg: string;
}

export interface RecursionStep {
  id: string; // Unique ID for the step
  stepTitle?: string; // e.g. "Calling factorial(3)" or "Base Case Reached"
  explanation: string;
  callStack?: CallStackFrame[]; // Current state of the call stack
  computation?: string; // For Factorial/Fibonacci, e.g., "3 * factorial(2)" or "fib(5) = fib(4) + fib(3)"
  returnValue?: number | string; // Value being returned by current function call in this step
  hanoiPegsState?: HanoiPegsState; // For Tower of Hanoi: { A: [3,2,1], B: [], C: [] }
  hanoiMove?: HanoiMove; // For Tower of Hanoi: { disk: 1, fromPeg: 'A', toPeg: 'C' }
  isBaseCase?: boolean;
  finalResult?: number | string | null; // The final result of the entire recursive computation
}
