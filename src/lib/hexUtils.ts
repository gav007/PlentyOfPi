/**
 * @file hexUtils.ts
 * Utility functions for hexadecimal conversions for the Hex Boxes game.
 */

/**
 * Converts a decimal number (0-255) to its two-character hexadecimal string.
 * Ensures the output is always two characters, padding with a leading zero if necessary.
 * @param decimal - The decimal number to convert.
 * @returns The two-character hexadecimal string (e.g., "D4", "0A").
 */
export function decimalToFullHexString(decimal: number): string {
  if (decimal < 0 || decimal > 255 || isNaN(decimal)) {
    // Handle invalid input gracefully, though game logic should prevent this.
    return "00";
  }
  return decimal.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Converts a decimal number (0-255) into its high and low hexadecimal nibbles.
 * @param decimal - The decimal number to convert.
 * @returns An object with 'high' and 'low' nibble characters.
 */
export function decimalToHexNibbles(decimal: number): { high: string; low: string } {
  const fullHex = decimalToFullHexString(decimal);
  return {
    high: fullHex.charAt(0),
    low: fullHex.charAt(1),
  };
}

/**
 * Converts a pair of hexadecimal nibbles (as strings) to their decimal equivalent.
 * Returns null if either nibble is null or invalid.
 * @param highNibble - The high (most significant) hex digit character (0-F).
 * @param lowNibble - The low (least significant) hex digit character (0-F).
 * @returns The decimal value, or null if conversion is not possible.
 */
export function hexNibblesToDecimal(highNibble: string | null, lowNibble: string | null): number | null {
  if (highNibble === null || lowNibble === null) {
    return null;
  }
  const hexString = `${highNibble}${lowNibble}`;
  if (!/^[0-9A-F]{2}$/i.test(hexString)) {
    return null; // Invalid hex string
  }
  return parseInt(hexString, 16);
}

/**
 * Array of hexadecimal digits 0-F.
 */
export const HEX_DIGITS: string[] = [
  '0', '1', '2', '3',
  '4', '5', '6', '7',
  '8', '9', 'A', 'B',
  'C', 'D', 'E', 'F',
];

/**
 * Generates a random decimal number between 0 and 255, inclusive.
 * @returns A random decimal number.
 */
export function generateRandomDecimalTarget(): number {
  return Math.floor(Math.random() * 256);
}
