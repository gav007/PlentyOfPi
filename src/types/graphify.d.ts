
export interface FunctionDefinition { // Renamed from Expression for clarity
  id: string; // Unique ID for each function
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
  id: string; // Corresponds to FunctionDefinition id
  points: Point[];
  color: string;
  expression: string; // Store original expression for tooltips/debugging
  // function-plot specific options if needed
  fn?: string; // function-plot can take string functions
  graphType?: 'polyline' | 'scatter';
  sampler?: 'builtIn' | 'interval' | 'adaptive';
  skipTip?: boolean;
}

export interface GraphViewSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  grid?: boolean; // From function-plot options
  xAxis?: {
    label?: string;
    domain?: [number, number];
  };
  yAxis?: {
    label?: string;
    domain?: [number, number];
  };
  width?: number;
  height?: number;
  disableZoom?: boolean; // To control internal zoom of function-plot
  target?: string; // Target element for function-plot
  data?: any[]; // For function-plot data structure
  plugins?: any[]; // For function-plot plugins
  autoScaleY?: boolean; // Custom flag for our logic
}

// For Firestore
export interface GraphSet {
  id?: string; // Firestore document ID
  name: string;
  createdAt: any; // Firebase Timestamp or Date
  updatedAt: any; // Firebase Timestamp or Date
  functions: FunctionDefinition[];
  viewSettings: Omit<GraphViewSettings, 'target' | 'width' | 'height' | 'data' | 'plugins'>; // Persist relevant view settings
}
