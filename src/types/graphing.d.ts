
export interface Expression {
  id: string;
  value: string;
  color: string;
  error: string | null;
  visible: boolean;
}

export interface PlotPoint {
  x: number;
  y: number | null; // Allow null for discontinuities
}

export interface PlotData {
  id: string; // Corresponds to Expression id
  data: PlotPoint[];
  color: string;
  name: string; // Typically the expression string itself for the legend
}
