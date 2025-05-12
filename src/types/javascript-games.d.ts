
export interface OutputMatchQuestionJS {
  code: string; // JavaScript code snippet
  options: string[]; // Possible output strings
  correct: string; // The correct output string
  explanation?: string; // Explanation for the answer
}

export interface SyntaxSpotterProblemJS {
  lines: string[]; // Array of code lines
  errorLineIndex: number; // 0-based index of the line with the syntax error
  explanation: string; // Explanation of the error and fix
}

export interface DebugItChallengeJS {
  id: string; // Unique ID for the challenge
  description: string; // Description of what the code should do or hint about the bug
  initialCode: string; // The broken JavaScript code
  expectedOutput: string; // The expected console output after fixing
  solution?: string; // Optional: The corrected code snippet
  difficulty?: 'easy' | 'medium' | 'hard';
}
