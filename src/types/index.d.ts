
import type { LucideIcon } from 'lucide-react';
export type { LessonModule, LabItem, QuizItem, QuizQuestion } from './lessons';
export type { OutputMatchQuestion, SyntaxSpotterProblem, DebugItChallenge, MathBattleProblem } from './python-games';
export type { JSModule, JSLessonItem, JSLabItem, JSQuizItem, JSQuizQuestion } from './javascript-lessons';
export type { OutputMatchQuestionJS, SyntaxSpotterProblemJS, DebugItChallengeJS } from './javascript-games';
export type { FunctionDefinition, Point, PlotData, GraphViewSettings, GraphSet } from './graphify'; // Export Graphify types

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon; 
  label?: string;
  description?: string; 
  subItems?: NavItem[]; 
};

export interface FeatureCardItem {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  dataAiHint?: string;
  isComingSoon?: boolean;
  ctaLabel?: string;
}


// Types for Fraction Duel Game
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
  startTimePerTurn: number | null; 
}

// Types for Graph Traversal Visualizer
export interface GraphNode { 
  id: string; 
  x: number; 
  y: number; 
  label?: string; 
}
export interface GraphEdge { 
  source: string; 
  target: string; 
  weight?: number; 
  id: string; 
}
export interface GraphData { 
  nodes: GraphNode[]; 
  edges: GraphEdge[]; 
}
    
// Types for Recursion Visualizer
export interface CallStackFrame {
  id: string;
  name: string;
  params: string;
}

export interface HanoiMove {
  disk: number;
  fromPeg: string;
  toPeg: string;
}

export interface HanoiPegsState {
  A: number[];
  B: number[];
  C: number[];
}

export interface RecursionStep {
  id: string; // Unique ID for React key
  stepTitle: string;
  explanation: string;
  callStack: CallStackFrame[];
  computation?: string; // e.g., "factorial(3) = 3 * factorial(2)"
  returnValue?: number | string; // Value returned by this specific call
  hanoiMove?: HanoiMove;
  hanoiPegsState?: HanoiPegsState; // State of pegs *after* the move
  finalResult?: number | string; // Overall final result of the initial call
}
