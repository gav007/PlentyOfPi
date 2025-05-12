
import * as math from 'mathjs';

const PLOT_POINTS = 200; // Number of points to plot for each function

/**
 * Parses a mathematical expression string into an evaluatable function.
 * @param expression - The string expression (e.g., "x^2 + sin(x)").
 * @returns A function that takes x and returns y, or null if parsing fails.
 * @throws Error if the expression is invalid.
 */
export function parseExpression(expression: string): ((x: number) => number) | null {
  if (!expression.trim()) {
    return null;
  }
  try {
    const node = math.parse(expression);
    const compiled = node.compile();
    return (x: number) => {
      try {
        const result = compiled.evaluate({ x });
        // Ensure result is a finite number. mathjs can return complex numbers, units, etc.
        if (typeof result === 'number' && isFinite(result)) {
          return result;
        }
        // Handle cases where mathjs might return a Complex number for real inputs (e.g. sqrt(-1))
        // or other non-numeric results. For basic graphing, we treat these as non-plottable (NaN or null).
        if (typeof result === 'object' && result !== null && 're' in result && 'im' in result && result.im === 0) {
             if(typeof result.re === 'number' && isFinite(result.re)) return result.re;
        }
        return NaN; // Or null, depending on how Recharts handles non-numeric y
      } catch (evalError) {
        // Errors during evaluation (e.g., log of negative number if not handled by above)
        return NaN; 
      }
    };
  } catch (parseError) {
    console.error("Parsing error in mathjs:", parseError);
    throw new Error("Invalid math expression.");
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
  if (xMin >= xMax) return data; // Invalid domain

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
      yValue = null; // Error during function evaluation for this x
    }
    data.push({ x, y: yValue });
  }
  return data;
}
