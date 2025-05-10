
/**
 * @file AngleEvaluation.ts
 * Utility functions for the Unit Circle game, including angle comparison and formatting.
 */

export const commonAnglesDegrees: number[] = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
];

/**
 * Converts an angle in radians to its string representation with π.
 * @param rad - Angle in radians.
 * @returns String representation (e.g., "π/2", "3π/4", "2π") or decimal if no simple fraction.
 */
export function formatAngleToPiString(rad: number): string {
  const tolerance = 0.001; // Tolerance for float comparisons
  // Normalize rad to be in [0, 2π) range for comparison
  let normalizedRad = ((rad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Handle 2π explicitly as it can be slightly less due to float math
  if (Math.abs(normalizedRad - 2 * Math.PI) < tolerance || Math.abs(normalizedRad) < tolerance && rad !== 0) { // Second condition for values very close to 0 but were meant as 2PI
      if(rad !== 0 && Math.abs(rad % (2 * Math.PI)) < tolerance) return "2π"; // if original rad was a multiple of 2pi
      if(Math.abs(normalizedRad - 2 * Math.PI) < tolerance) return "2π";
  }
  if (Math.abs(normalizedRad) < tolerance && rad === 0) return "0";


  const fractions = [
    { val: 0, str: "0" }, { val: Math.PI / 6, str: "π/6" }, { val: Math.PI / 4, str: "π/4" },
    { val: Math.PI / 3, str: "π/3" }, { val: Math.PI / 2, str: "π/2" }, { val: 2 * Math.PI / 3, str: "2π/3" },
    { val: 3 * Math.PI / 4, str: "3π/4" }, { val: 5 * Math.PI / 6, str: "5π/6" }, { val: Math.PI, str: "π" },
    { val: 7 * Math.PI / 6, str: "7π/6" }, { val: 5 * Math.PI / 4, str: "5π/4" }, { val: 4 * Math.PI / 3, str: "4π/3" },
    { val: 3 * Math.PI / 2, str: "3π/2" }, { val: 5 * Math.PI / 3, str: "5π/3" }, { val: 7 * Math.PI / 4, str: "7π/4" },
    { val: 11 * Math.PI / 6, str: "11π/6" }, { val: 2 * Math.PI, str: "2π" }
  ];

  for (const frac of fractions) {
    if (Math.abs(normalizedRad - frac.val) < tolerance) {
      return frac.str;
    }
  }
  // Fallback for angles not matching common fractions
  return `${(normalizedRad / Math.PI).toFixed(2)}π (${((normalizedRad * 180) / Math.PI).toFixed(1)}°)`;
}


/**
 * Checks if the player's angle matches the target angle, with optional tolerance for game mode.
 * @param playerAngleRad - Player's selected angle in radians.
 * @param targetAngleRad - Target angle in radians.
 * @param isGameMode - Boolean indicating if game mode tolerance should be applied.
 * @returns Object containing match status (boolean) and angle error in degrees.
 */
export function checkAngleMatch(
  playerAngleRad: number,
  targetAngleRad: number,
  isGameMode: boolean
): { match: boolean; errorDegrees: number } {
  const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

  // Normalize angles to be within [0, 360) degrees
  const playerAngleDeg = (toDegrees(playerAngleRad % (2 * Math.PI)) + 360) % 360;
  const targetAngleDeg = (toDegrees(targetAngleRad % (2 * Math.PI)) + 360) % 360;

  let diff = Math.abs(playerAngleDeg - targetAngleDeg);
  // Consider the shorter path around the circle
  const angleErrorDegrees = Math.min(diff, 360 - diff);

  if (isGameMode) {
    // Game mode: allow tolerance (e.g., ±10 degrees)
    return { match: angleErrorDegrees <= 10, errorDegrees: angleErrorDegrees };
  } else {
    // Learning mode: require very high precision (almost exact match, accounting for float issues)
    return { match: angleErrorDegrees < 0.1, errorDegrees: angleErrorDegrees };
  }
}
