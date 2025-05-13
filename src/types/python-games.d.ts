
export interface OutputMatchQuestion {
  code: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export interface SyntaxSpotterProblem {
  lines: string[];
  errorLineIndex: number; // 0-based index of the line with the error
  explanation: string;
}

export interface DebugItChallenge {
  initialCode: string;
  description: string; // Description of what the code should do or hint about the bug
  expectedOutput: string;
  solution: string;
}

export interface MathBattleProblem {
  id: string;
  question: string;
  options: number[]; // Array of numbers for multiple choice
  answer: number;    // The correct numerical answer
  type: 'arithmetic'; // Simplified to only arithmetic
}
