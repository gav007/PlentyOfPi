
// src/types/fractionDuel.d.ts

export interface FractionValue {
  num: number;
  den: number;
}

export type FractionOperator = '+' | '-' | '*' | '/';

export interface FractionExpressionDef {
  fractions: FractionValue[];
  operator: FractionOperator;
}

export interface GameState {
  turn: number;
  expression: FractionExpressionDef | null;
  correctAnswer: FractionValue | null;
  choices: FractionValue[];
  selectedAnswer: FractionValue | null;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  highestStreak: number;
  phase: 'question' | 'feedback' | 'summary';
  startTimePerTurn: number | null; // For potential time bonus
}
