
import type { LucideIcon } from 'lucide-react';
export type { LessonModule, LabItem, QuizItem, QuizQuestion } from './lessons'; // Re-export lesson types
export type { OutputMatchQuestion, SyntaxSpotterProblem, DebugItChallenge } from './python-games'; // Re-export python game types
export type { JSModule, JSLessonItem, JSLabItem, JSQuizItem, JSQuizQuestion } from './javascript-lessons'; // Re-export JS lesson types
export type { OutputMatchQuestionJS, SyntaxSpotterProblemJS, DebugItChallengeJS } from './javascript-games'; // Re-export JS game types
export type { Expression, ExpressionPlotData, GraphDomain, GraphRange } from './graphing'; // Re-export graphing types
export type { SortAlgorithmType, SortStep } from './sort-algorithms'; 
export type { SearchAlgorithmType, SearchStep } from './search-algorithms';
export type { RecursionStep, CallStackFrame, HanoiPegsState, HanoiMove } from './recursion-visualizer';


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

export interface GraphSearchStep {
  explanation: string;
  visited: Set<string>; // Nodes fully processed or added to queue/stack
  queue?: string[];      // For BFS: current queue
  stack?: string[];      // For DFS: current stack
  distances?: Map<string, number>; // For Dijkstra's: shortest distance from start
  parents?: Map<string, string | null>; // For Dijkstra's & path reconstruction
  currentNode?: string;  // Node being currently processed (e.g., just dequeued/popped)
  processingNeighborsOf?: string; // Alternative to currentNode if we want to highlight the source of exploration
  highlightedEdge?: { source: string; target: string }; // Edge being currently explored
  finalPath?: string[]; // For pathfinding algorithms like Dijkstra's or BFS/DFS if finding a path to a target
  searchComplete?: boolean; // True if the algorithm has finished
  message?: string; // Final message, e.g., "Target found" or "BFS Complete"
}
    