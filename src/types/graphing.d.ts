
export interface Expression {
  id: string;
  value: string;
  color: string;
  error: string | null;
  isVisible: boolean;
}

export interface ExpressionPlotData extends Expression {
  points: { x: number; y: number | null }[];
}

export interface GraphDomain {
  xMin: number;
  xMax: number;
}

export interface GraphRange {
  yMin: number | 'auto';
  yMax: number | 'auto';
}
