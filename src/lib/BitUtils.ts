/**
 * @file BitUtils.ts
 * Utility functions for binary, decimal, and hexadecimal conversions,
 * and other helper functions for the Binary Converter Game.
 */

/**
 * Converts a binary string to its decimal equivalent.
 * @param binaryString - The binary string to convert.
 * @returns The decimal number.
 */
export function binaryToDecimal(binaryString: string): number {
  if (!/^[01]+$/.test(binaryString) && binaryString !== "") {
    return 0; // Or throw error
  }
  return parseInt(binaryString, 2) || 0;
}

/**
 * Converts a binary string to its hexadecimal equivalent.
 * @param binaryString - The binary string to convert.
 * @param bitCount - The number of bits (8 or 16) for padding.
 * @returns The hexadecimal string (e.g., "0xAD").
 */
export function binaryToHex(binaryString: string, bitCount: number): string {
  const decimalValue = binaryToDecimal(binaryString);
  return decimalToHex(decimalValue, bitCount);
}

/**
 * Converts a decimal number to its binary string equivalent, padded to bitCount.
 * @param decimalValue - The decimal number to convert.
 * @param bitCount - The number of bits (e.g., 8 or 16).
 * @returns The binary string.
 */
export function decimalToBinary(decimalValue: number, bitCount: number): string {
  if (isNaN(decimalValue) || decimalValue < 0) return "".padStart(bitCount, "0");
  return decimalValue.toString(2).padStart(bitCount, "0");
}

/**
 * Converts a decimal number to its hexadecimal string equivalent, padded appropriately.
 * @param decimalValue - The decimal number to convert.
 * @param bitCount - The number of bits (8 or 16) to determine padding.
 * @returns The hexadecimal string (e.g., "0xAD").
 */
export function decimalToHex(decimalValue: number, bitCount: number): string {
  if (isNaN(decimalValue) || decimalValue < 0) {
    const hexPadding = bitCount / 4;
    return "0x" + "".padStart(hexPadding, "0");
  }
  const hexString = decimalValue.toString(16).toUpperCase();
  const paddingLength = bitCount / 4;
  return "0x" + hexString.padStart(paddingLength, "0");
}

/**
 * Generates a random decimal number within the range of the given bit count.
 * @param bitCount - The number of bits (e.g., 8 for 0-255).
 * @returns A random decimal number.
 */
export function generateRandomDecimal(bitCount: number): number {
  const maxDecimal = Math.pow(2, bitCount) - 1;
  return Math.floor(Math.random() * (maxDecimal + 1));
}
