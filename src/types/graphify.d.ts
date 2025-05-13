
export interface Expression {
  id: string;
  value: string;
  color: string;
  isVisible: boolean;
  error?: string | null; // Add error field
}

export interface Point {
  x: number;
  y: number | null; 
}

export interface PlotData {
  id: string;
  points: Point[];
  color: string;
  expression: string; 
  fn?: (x: number) => number | null; // Optional: store compiled function for direct use in canvas
  fnType?: string; // To handle different function-plot types
}

export interface GraphViewSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  autoScaleY?: boolean; 
}
