
import type { LucideIcon } from 'lucide-react';
export type { LessonModule, LabItem, QuizItem, QuizQuestion } from './lessons'; // Re-export lesson types
export type { OutputMatchQuestion, SyntaxSpotterProblem, DebugItChallenge, MathBattleProblem } from './python-games'; // Re-export python game types
export type { JSModule, JSLessonItem, JSLabItem, JSQuizItem, JSQuizQuestion } from './javascript-lessons'; // Re-export JS lesson types
export type { OutputMatchQuestionJS, SyntaxSpotterProblemJS, DebugItChallengeJS } from './javascript-games'; // Re-export JS game types
export type { Expression, ExpressionPlotData, GraphDomain, GraphRange } from './graphing'; // Re-export graphing types


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

// Types for Graph Traversal Visualizer - RETAINED IF OTHER GRAPH TOOLS EXIST, REMOVE IF NOT
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
    

