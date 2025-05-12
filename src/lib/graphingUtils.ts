
import * as math from 'mathjs';

const PLOT_POINTS = 200; // Number of points to plot for each function

/**
 * Parses a mathematical expression string into an evaluatable function.
 * @param expression - The string expression (e.g., "x^2 + sin(x)").
 * @returns A function that takes x and returns y, or null if parsing fails.
 * @throws Error with a descriptive message if the expression is invalid or causes issues.
 */
export function parseExpression(expression: string): ((x: number) => number) | null {
  if (!expression.trim()) {
    return null;
  }
  try {
    // Basic sanitization/normalization - can be expanded
    const cleanedExpression = expression
      .replace(/pi/gi, 'pi') // Ensure 'pi' is lowercase for mathjs
      .replace(/e\^/gi, 'exp'); // Replace e^ with exp() for clarity if needed, though mathjs handles 'e'

    const node = math.parse(cleanedExpression);
    const compiled = node.compile();
    
    return (x: number) => {
      try {
        const result = compiled.evaluate({ x });
        if (typeof result === 'number' && isFinite(result)) {
          return result;
        }
        // Handle mathjs Complex numbers if imaginary part is zero (e.g. sqrt(-1)^2)
        if (typeof result === 'object' && result !== null && 're' in result && 'im' in result && Math.abs(result.im) < 1e-9) {
             if(typeof result.re === 'number' && isFinite(result.re)) return result.re;
        }
        return NaN; // Indicates a non-plottable point for this x
      } catch (evalError: any) {
        // console.warn(`Evaluation error for expression "${expression}" at x=${x}:`, evalError.message);
        return NaN; // Error during evaluation for specific x (e.g. log of negative)
      }
    };
  } catch (parseError: any) {
    console.error(`Parsing error for expression "${expression}":`, parseError.message);
    // Propagate a more user-friendly error or specific type
    if (parseError.message.includes("Undefined symbol")) {
      throw new Error(`Invalid symbol or function used: ${parseError.message.substring(parseError.message.indexOf('Undefined symbol') + 17)}`);
    }
    throw new Error(`Invalid expression: ${parseError.message}`);
  }
}

/**
 * Generates an array of (x, y) points for a given function over a domain.
 * @param func - The evaluatable function (x) => y.
 * @param xMin - The minimum x value for the domain.
 * @param xMax - The maximum x value for the domain.
 * @returns An array of { x: number, y: number | null } points.
 */
export function generatePlotData(
  func: (x: number) => number,
  xMin: number,
  xMax: number
): { x: number; y: number | null }[] {
  const data: { x: number; y: number | null }[] = [];
  if (xMin >= xMax) {
    // console.warn("Invalid domain for plot data generation: xMin >= xMax", {xMin, xMax});
    return data; 
  }

  const step = (xMax - xMin) / PLOT_POINTS;

  for (let i = 0; i <= PLOT_POINTS; i++) {
    const x = xMin + i * step;
    let yValue: number | null;
    try {
      yValue = func(x);
      if (isNaN(yValue) || !isFinite(yValue)) {
        yValue = null; // Use null for Recharts to create gaps for undefined points
      }
    } catch (e) {
      // This catch might be redundant if func itself handles its internal errors and returns NaN
      yValue = null; 
    }
    data.push({ x, y: yValue });
  }
  return data;
}

