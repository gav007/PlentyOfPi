
import type { LucideIcon } from 'lucide-react';
export type { LessonModule, LabItem, QuizItem, QuizQuestion } from './lessons'; // Re-export lesson types
export type { OutputMatchQuestion, SyntaxSpotterProblem, DebugItChallenge } from './python-games'; // Re-export python game types
export type { JSModule, JSLessonItem, JSLabItem, JSQuizItem, JSQuizQuestion } from './javascript-lessons'; // Re-export JS lesson types
export type { OutputMatchQuestionJS, SyntaxSpotterProblemJS, DebugItChallengeJS } from './javascript-games'; // Re-export JS game types
export type { Expression, ExpressionPlotData, GraphDomain, GraphRange } from './graphing'; // Re-export graphing types
export type { SortAlgorithmType, SortStep } from './sort-algorithms'; // Added for sorting visualizer
export type { SearchAlgorithmType, SearchStep } from './search-algorithms';
export type { RecursionStep, CallStackFrame, HanoiPegsState, HanoiMove } from './recursion-visualizer';


export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon; // Allow any LucideIcon
  label?: string;
  description?: string; // Optional description for dropdown items
  subItems?: NavItem[]; 
};

export interface FeatureCardItem {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  isComingSoon?: boolean;
  ctaLabel?: string;
}


// Types for Fraction Duel Game (kept for other parts of the app)
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

    
