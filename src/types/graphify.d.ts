
export interface FunctionDefinition {
  id: string;
  expression: string;
  color: string;
  isVisible: boolean;
  error?: string | null;
}

export interface Point {
  x: number;
  y: number | null; 
}

export interface PlotData {
  id: string;
  points: Point[];
  color: string;
  expression: string; // Keep original expression for display/tooltip
}

export interface GraphViewSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  autoScaleY?: boolean; // For Y-axis auto-scaling
}
