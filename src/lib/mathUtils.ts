
/**
 * @file mathUtils.ts
 * Utility functions for common mathematical operations.
 */

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The GCD of a and b.
 */
export function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

/**
 * Calculates the Least Common Multiple (LCM) of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The LCM of a and b.
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculates the LCM for an array of numbers.
 * @param numbers - An array of numbers.
 * @returns The LCM of all numbers in the array.
 */
export function lcmArray(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
    if (result === 0) return 0; // If any number is 0, LCM is 0 (or undefined, handling as 0)
  }
  return result;
}

/**
 * Calculates the sum of an array of numbers.
 * @param numbers - An array of numbers.
 * @returns The sum of the numbers.
 */
export function sumArray(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
