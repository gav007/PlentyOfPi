
import type { RecursionStep, CallStackFrame, HanoiPegsState, HanoiMove } from '@/types/recursion-visualizer';
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
    const currentFrame = { id: newCallId(), name: 'factorial', params: `${num}` };
    callStack.push(currentFrame);
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
        });
        callStack.pop(); 
        steps.push({
            id: newStepId(),
            stepTitle: `Return from factorial(${num}) with Undefined`,
            explanation: `Returning "Undefined". Removed from call stack.`,
            callStack: [...callStack],
            finalResult: "Undefined" 
        });
        return NaN; 
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
        stepTitle: `Return from factorial(${num}) with 1`,
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
      
      // currentFrame for factorial(num) is still on stack here
       steps.push({
        id: newStepId(),
        stepTitle: `Calculating for factorial(${num})`,
        explanation: `factorial(${num - 1}) returned ${resultFromRecursiveCall}. Now calculating ${num} * ${resultFromRecursiveCall}.`,
        callStack: [...callStack], // currentFrame is still here
        computation: `factorial(${num}) = ${num} * ${resultFromRecursiveCall}`
      });

      const finalVal = num * resultFromRecursiveCall;
      steps.push({
        id: newStepId(),
        stepTitle: `Return value for factorial(${num})`,
        explanation: `factorial(${num}) returns ${finalVal}.`,
        callStack: [...callStack], // currentFrame is still here
        computation: `factorial(${num}) = ${finalVal}`,
        returnValue: finalVal
      });
      callStack.pop(); 
      steps.push({
        id: newStepId(),
        stepTitle: `Return from factorial(${num}) with ${finalVal}`,
        explanation: `Returning ${finalVal}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return finalVal;
    }
  }

  const finalFactorialResult = factorialRecursive(n);
  if (steps.length > 0 && steps[steps.length - 1].finalResult === undefined) { // Only set if not already set (e.g. by error case)
    steps[steps.length - 1].finalResult = isNaN(finalFactorialResult) ? "Undefined" : finalFactorialResult;
  }
  return steps;
}


export function generateFibonacciSteps(n: number): RecursionStep[] {
  stepIdCounter = 0;
  callIdCounter = 0;
  const steps: RecursionStep[] = [];
  const callStack: CallStackFrame[] = [];

  function fibonacciRecursive(num: number): number {
    const currentFrame = { id: newCallId(), name: 'fib', params: `${num}` };
    callStack.push(currentFrame);
    steps.push({
      id: newStepId(),
      stepTitle: `Calling fib(${num})`,
      explanation: `Function fib(${num}) called. Added to call stack.`,
      callStack: [...callStack],
      computation: `fib(${num}) = ?`
    });

    if (num < 0) { 
        steps.push({
            id: newStepId(),
            stepTitle: `Base Case for fib(${num})`,
            explanation: `Input ${num} is negative. Fibonacci sequence usually starts from 0 or 1.`,
            callStack: [...callStack],
            computation: `fib(${num}) -> Undefined`,
        });
        callStack.pop(); 
        steps.push({
            id: newStepId(),
            stepTitle: `Return from fib(${num}) with Undefined`,
            explanation: `Returning "Undefined". Removed from call stack.`,
            callStack: [...callStack],
            finalResult: "Undefined"
        });
        return NaN; 
    }
    if (num <= 1) { 
      steps.push({
        id: newStepId(),
        stepTitle: `Base Case for fib(${num})`,
        explanation: `Base case reached: fib(${num}) returns ${num}.`,
        callStack: [...callStack],
        computation: `fib(${num}) = ${num}`,
        returnValue: num
      });
      const returnValue = num;
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from fib(${num}) with ${returnValue}`,
        explanation: `Returning ${returnValue}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return returnValue;
    } else {
      steps.push({
        id: newStepId(),
        stepTitle: `Recursive Step for fib(${num})`,
        explanation: `fib(${num}) will call fib(${num - 1}) + fib(${num - 2}). First calling fib(${num - 1}).`,
        callStack: [...callStack],
        computation: `fib(${num}) = fib(${num - 1}) + fib(${num - 2})`
      });
      const fibNMinus1 = fibonacciRecursive(num - 1);
      
      // currentFrame for fib(num) is still on stack
      steps.push({
        id: newStepId(),
        stepTitle: `Recursive Step for fib(${num})`,
        explanation: `fib(${num - 1}) returned ${fibNMinus1}. Now calling fib(${num - 2}).`,
        callStack: [...callStack],
        computation: `fib(${num}) = ${fibNMinus1} + fib(${num - 2})`
      });
      const fibNMinus2 = fibonacciRecursive(num - 2);

      // currentFrame for fib(num) is still on stack
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
        stepTitle: `Return from fib(${num}) with ${sumResult}`,
        explanation: `Returning ${sumResult}. Removed from call stack.`,
        callStack: [...callStack],
      });
      return sumResult;
    }
  }

  const finalFibResult = fibonacciRecursive(n);
  if (steps.length > 0 && steps[steps.length - 1].finalResult === undefined) {
    steps[steps.length - 1].finalResult = isNaN(finalFibResult) ? "Undefined" : finalFibResult;
  }
  return steps;
}


export function generateHanoiSteps(n: number, source: string, destination: string, auxiliary: string, initialDisks: number[]): RecursionStep[] {
  stepIdCounter = 0;
  callIdCounter = 0;
  const steps: RecursionStep[] = [];
  const callStack: CallStackFrame[] = [];
  let pegs: HanoiPegsState = { A: [], B: [], C: [] };
  (pegs as any)[source] = [...initialDisks]; 


  function hanoiRecursive(numDisks: number, from: string, to: string, aux: string) {
    const currentFrame = { id: newCallId(), name: 'hanoi', params: `${numDisks}, ${from}->${to} via ${aux}` };
    callStack.push(currentFrame);
    steps.push({
      id: newStepId(),
      stepTitle: `Call hanoi(${numDisks}, ${from}, ${to}, ${aux})`,
      explanation: `Recursive call to move ${numDisks} disk(s) from ${from} to ${to} using ${aux}.`,
      callStack: [...callStack],
      hanoiPegsState: JSON.parse(JSON.stringify(pegs))
    });

    if (numDisks === 1) {
      const diskToMove = (pegs as any)[from].pop();
      if (diskToMove !== undefined) {
        (pegs as any)[to].push(diskToMove);
      }
      steps.push({
        id: newStepId(),
        stepTitle: `Move disk ${diskToMove} from ${from} to ${to}`,
        explanation: `Base case: Moving disk ${diskToMove} directly from peg ${from} to peg ${to}.`,
        callStack: [...callStack],
        hanoiMove: { disk: diskToMove || 0, fromPeg: from, toPeg: to },
        hanoiPegsState: JSON.parse(JSON.stringify(pegs)),
      });
      callStack.pop();
      steps.push({
        id: newStepId(),
        stepTitle: `Return from hanoi(1, ${from}, ${to}, ${aux})`,
        explanation: `Base case move completed. Returning.`,
        callStack: [...callStack],
        hanoiPegsState: JSON.parse(JSON.stringify(pegs))
      });
      return;
    }

    hanoiRecursive(numDisks - 1, from, aux, to);
    
    // currentFrame for hanoi(numDisks, from, to, aux) is on stack
    steps.push({
        id: newStepId(),
        stepTitle: `Returned from hanoi(${numDisks - 1}, ${from}, ${aux}, ${to})`,
        explanation: `Now move disk ${numDisks} from ${from} to ${to}.`,
        callStack: [...callStack],
        hanoiPegsState: JSON.parse(JSON.stringify(pegs))
    });

    const diskToMoveN = (pegs as any)[from].pop();
    if (diskToMoveN !== undefined) {
      (pegs as any)[to].push(diskToMoveN);
    }
     steps.push({
      id: newStepId(),
      stepTitle: `Move disk ${diskToMoveN} from ${from} to ${to}`,
      explanation: `Moving disk ${diskToMoveN} (largest in current subproblem) from ${from} to ${to}.`,
      callStack: [...callStack],
      hanoiMove: { disk: diskToMoveN || 0, fromPeg: from, toPeg: to },
      hanoiPegsState: JSON.parse(JSON.stringify(pegs)),
    });

    hanoiRecursive(numDisks - 1, aux, to, from);

    callStack.pop();
     steps.push({
        id: newStepId(),
        stepTitle: `Return from hanoi(${numDisks}, ${from}, ${to}, ${aux})`,
        explanation: `All ${numDisks} disks moved from ${from} to ${to}. Returning.`,
        callStack: [...callStack],
        hanoiPegsState: JSON.parse(JSON.stringify(pegs))
    });
  }

  hanoiRecursive(n, source, destination, auxiliary);
  if (steps.length > 0) {
    steps[steps.length-1].finalResult = "Tower Complete!";
  }
  return steps;
}

