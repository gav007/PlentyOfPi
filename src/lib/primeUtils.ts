
/**
 * Checks if a number is prime.
 * @param n The number to check.
 * @returns True if n is prime, false otherwise.
 */
export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i = i + 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Gets all factors of a number (excluding 1 and the number itself if it's prime or has other factors).
 * For prime numbers, it will return an empty array, implying factors are 1 and itself.
 * For 0 and 1, it returns an empty array as they have special factorization properties.
 * @param n The number to factorize.
 * @returns An array of factors.
 */
export function getFactors(n: number): number[] {
  if (n <= 1) return []; // 0 and 1 don't have factors in the typical sense for this tool
  
  const factors: number[] = [];
  // Start from 2 because 1 is always a factor
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i * i !== n) { // Add the corresponding factor if not a perfect square
        factors.push(n / i);
      }
    }
  }
  // If no factors were found (other than 1 and n), and n is not prime,
  // this means it's likely factors.length will be 0.
  // For prime numbers, this will also be empty.
  // The result is sorted for consistency.
  return factors.sort((a, b) => a - b);
}


/**
 * Gets the next 'count' prime numbers after a given number.
 * @param startAfter The number after which to start finding primes.
 * @param count The number of prime numbers to find.
 * @returns An array of the next 'count' prime numbers.
 */
export function getNextPrimes(startAfter: number, count: number): number[] {
  const primes: number[] = [];
  let num = startAfter + 1;
  while (primes.length < count) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
    // Safety break for very large startAfter values if count is high, though unlikely with typical use
    if (num > startAfter + count * Math.log(startAfter + count) * 2 && count > 5) { 
        // Heuristic: if we've searched too far, break to prevent hangs.
        // Approximate upper bound for nth prime is n*ln(n) + n*ln(ln(n)).
        // This is a very loose safety break.
        break; 
    }
  }
  return primes;
}
