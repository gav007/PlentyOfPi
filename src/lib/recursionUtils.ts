
import type { RecursionStep, CallStackFrame, HanoiPegsState } from '@/types/recursion-visualizer';
let stepIdCounter = 0;
let callIdCounter = 0;

function newStepId(): string { return `step-${stepIdCounter++}`; }
function newCallId(): string { return `call-${callIdCounter++}`; }

export function generateFactorialSteps(n: number): RecursionStep[] {
  stepIdCounter = 0;
  callIdCounter = 0;
  const steps: RecursionStep[] = [];
  const callStack: CallStackFrame[] = [];

  function factorialRecursive(num: number): number {
    const callId = newCallId();
    callStack.push({ id: callId, name: 'factorial', params: `${num}` });
    steps.push({
      id: newStepId(),
      stepTitle: `Calling factorial(${num})`,
      explanation: `Function factorial(${num}) called. Added to call stack.`,
      callStack: [...callStack],
      computation: `factorial(${num}) = ?`
    });

    if (num < 0) {
        steps.push({
            id: newStepId(),
            stepTitle: `Base Case for factorial(${num})`,
            explanation: `Input ${num} is negative. Factorial is undefined for negative numbers.`,
            callStack: [...callStack],
            computation: `factorial(${num}) -> Undefined`,
            finalResult: "Undefined"
        });
        callStack.pop();
         steps.push({
            id: newStepId(),
            stepTitle: `Return from factorial(${num})`,
            explanation: `Returning "Undefined". Removed from call stack.`,
            callStack: [...callStack],
        });
        return NaN; // Or throw an error / handle as specified
    }
    if (num === 0 || num === 1) {
      steps.push({
        id: newStepId(),
        stepTitle: `Base Case for factorial(${num})`,
        explanation: `Base case reached: factorial(${num}) returns 1.`,
        callStack: [...callStack],
        computation: `factorial(${num}) = 1`,
        returnValue: 1,
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from factorial(${num})`,
        explanation: `Returning 1. Removed from call stack.`,
        callStack: [...callStack],
      });
      return 1;
    } else {
      steps.push({
        id: newStepId(),
        stepTitle: `Recursive Step for factorial(${num})`,
        explanation: `factorial(${num}) will call ${num} * factorial(${num - 1}).`,
        callStack: [...callStack],
        computation: `factorial(${num}) = ${num} * factorial(${num - 1})`
      });
      const resultFromRecursiveCall = factorialRecursive(num - 1);
      
      // This state is after the recursive call has returned
      callStack.push({ id: callId, name: 'factorial', params: `${num}` }); // Re-add current frame to stack for this step
       steps.push({
        id: newStepId(),
        stepTitle: `Calculating for factorial(${num})`,
        explanation: `factorial(${num - 1}) returned ${resultFromRecursiveCall}. Now calculating ${num} * ${resultFromRecursiveCall}.`,
        callStack: [...callStack],
        computation: `factorial(${num}) = ${num} * ${resultFromRecursiveCall}`
      });

      const finalVal = num * resultFromRecursiveCall;
      steps.push({
        id: newStepId(),
        stepTitle: `Return value for factorial(${num})`,
        explanation: `factorial(${num}) returns ${finalVal}.`,
        callStack: [...callStack],
        computation: `factorial(${num}) = ${finalVal}`,
        returnValue: finalVal
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from factorial(${num})`,
        explanation: `Returning ${finalVal}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return finalVal;
    }
  }

  const finalFactorialResult = factorialRecursive(n);
  if (steps.length > 0) {
    steps[steps.length - 1].finalResult = finalFactorialResult;
  }
  return steps;
}


export function generateFibonacciSteps(n: number): RecursionStep[] {
  stepIdCounter = 0;
  callIdCounter = 0;
  const steps: RecursionStep[] = [];
  const callStack: CallStackFrame[] = [];

  function fibonacciRecursive(num: number): number {
    const callId = newCallId();
    callStack.push({ id: callId, name: 'fib', params: `${num}` });
    steps.push({
      id: newStepId(),
      stepTitle: `Calling fib(${num})`,
      explanation: `Function fib(${num}) called. Added to call stack.`,
      callStack: [...callStack],
      computation: `fib(${num}) = ?`
    });

    if (num < 0) { // Fibonacci typically not defined for negative, handle gracefully
        steps.push({
            id: newStepId(),
            stepTitle: `Base Case for fib(${num})`,
            explanation: `Input ${num} is negative. Fibonacci sequence usually starts from 0 or 1.`,
            callStack: [...callStack],
            computation: `fib(${num}) -> Undefined`, // Or handle as per common definitions
            finalResult: "Undefined"
        });
        callStack.pop();
        steps.push({
            id: newStepId(),
            stepTitle: `Return from fib(${num})`,
            explanation: `Returning "Undefined". Removed from call stack.`,
            callStack: [...callStack],
        });
        return NaN; 
    }
    if (num <= 1) { // Base cases: F(0) = 0, F(1) = 1
      steps.push({
        id: newStepId(),
        stepTitle: `Base Case for fib(${num})`,
        explanation: `Base case reached: fib(${num}) returns ${num}.`,
        callStack: [...callStack],
        computation: `fib(${num}) = ${num}`,
        returnValue: num
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from fib(${num})`,
        explanation: `Returning ${num}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return num;
    } else {
      steps.push({
        id: newStepId(),
        stepTitle: `Recursive Step for fib(${num})`,
        explanation: `fib(${num}) will call fib(${num - 1}) + fib(${num - 2}). First calling fib(${num - 1}).`,
        callStack: [...callStack],
        computation: `fib(${num}) = fib(${num - 1}) + fib(${num - 2})`
      });
      const fibNMinus1 = fibonacciRecursive(num - 1);
      
      // After fib(n-1) returns, this frame is back on top for the second call
      callStack.push({ id: callId, name: 'fib', params: `${num}` });
      steps.push({
        id: newStepId(),
        stepTitle: `Recursive Step for fib(${num})`,
        explanation: `fib(${num - 1}) returned ${fibNMinus1}. Now calling fib(${num - 2}).`,
        callStack: [...callStack],
        computation: `fib(${num}) = ${fibNMinus1} + fib(${num - 2})`
      });
      const fibNMinus2 = fibonacciRecursive(num - 2);

      // After fib(n-2) returns
      callStack.push({ id: callId, name: 'fib', params: `${num}` });
      const sumResult = fibNMinus1 + fibNMinus2;
      steps.push({
        id: newStepId(),
        stepTitle: `Calculating for fib(${num})`,
        explanation: `fib(${num - 1}) returned ${fibNMinus1}, fib(${num - 2}) returned ${fibNMinus2}. Summing: ${fibNMinus1} + ${fibNMinus2} = ${sumResult}.`,
        callStack: [...callStack],
        computation: `fib(${num}) = ${fibNMinus1} + ${fibNMinus2} = ${sumResult}`,
        returnValue: sumResult
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from fib(${num})`,
        explanation: `Returning ${sumResult}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return sumResult;
    }
  }

  const finalFibResult = fibonacciRecursive(n);
   if (steps.length > 0) {
    steps[steps.length - 1].finalResult = finalFibResult;
  }
  return steps;
}


export function generateHanoiSteps(n: number, source: string, destination: string, auxiliary: string, initialDisks: number[]): RecursionStep[] {
  stepIdCounter = 0;
  callIdCounter = 0;
  const steps: RecursionStep[] = [];
  const callStack: CallStackFrame[] = [];
  let pegs: HanoiPegsState = { A: [], B: [], C: [] };
  pegs[source as keyof HanoiPegsState] = [...initialDisks]; // Initialize the source peg


  function hanoiRecursive(numDisks: number, from: string, to: string, aux: string) {
    const callId = newCallId();
    callStack.push({ id: callId, name: 'hanoi', params: `${numDisks}, ${from}->${to} via ${aux}` });
    steps.push({
      id: newStepId(),
      stepTitle: `Call hanoi(${numDisks}, ${from}, ${to}, ${aux})`,
      explanation: `Recursive call to move ${numDisks} disk(s) from ${from} to ${to} using ${aux}.`,
      callStack: [...callStack],
      hanoiPegsState: { ...pegs } 
    });

    if (numDisks === 1) {
      const diskToMove = pegs[from as keyof HanoiPegsState].pop();
      if (diskToMove !== undefined) {
        pegs[to as keyof HanoiPegsState].push(diskToMove);
      }
      steps.push({
        id: newStepId(),
        stepTitle: `Move disk ${diskToMove} from ${from} to ${to}`,
        explanation: `Base case: Moving disk ${diskToMove} directly from peg ${from} to peg ${to}.`,
        callStack: [...callStack],
        hanoiMove: { disk: diskToMove || 0, fromPeg: from, toPeg: to },
        hanoiPegsState: { ...pegs },
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from hanoi(1, ${from}, ${to}, ${aux})`,
        explanation: `Base case move completed. Returning.`,
        callStack: [...callStack],
        hanoiPegsState: { ...pegs }
      });
      return;
    }

    // Move n-1 disks from source to auxiliary
    hanoiRecursive(numDisks - 1, from, aux, to);
    
    // After recursive call returns, current frame is back
    callStack.push({ id: callId, name: 'hanoi', params: `${numDisks}, ${from}->${to} via ${aux}` });
    steps.push({
        id: newStepId(),
        stepTitle: `Returned from hanoi(${numDisks - 1}, ${from}, ${aux}, ${to})`,
        explanation: `Now move largest disk ${numDisks} from ${from} to ${to}.`,
        callStack: [...callStack],
        hanoiPegsState: { ...pegs }
    });

    // Move the nth disk from source to destination
    const diskToMoveN = pegs[from as keyof HanoiPegsState].pop();
    if (diskToMoveN !== undefined) {
      pegs[to as keyof HanoiPegsState].push(diskToMoveN);
    }
     steps.push({
      id: newStepId(),
      stepTitle: `Move disk ${diskToMoveN} from ${from} to ${to}`,
      explanation: `Moving largest disk (${diskToMoveN}) in current subproblem from ${from} to ${to}.`,
      callStack: [...callStack],
      hanoiMove: { disk: diskToMoveN || 0, fromPeg: from, toPeg: to },
      hanoiPegsState: { ...pegs },
    });

    // Move n-1 disks from auxiliary to destination
    hanoiRecursive(numDisks - 1, aux, to, from);

    callStack.pop();
     steps.push({
        id: newStepId(),
        stepTitle: `Return from hanoi(${numDisks}, ${from}, ${to}, ${aux})`,
        explanation: `All ${numDisks} disks moved from ${from} to ${to}. Returning.`,
        callStack: [...callStack],
        hanoiPegsState: { ...pegs }
    });
  }

  hanoiRecursive(n, source, destination, auxiliary);
  if (steps.length > 0) {
    steps[steps.length-1].finalResult = "Tower Complete!";
  }
  return steps;
}
