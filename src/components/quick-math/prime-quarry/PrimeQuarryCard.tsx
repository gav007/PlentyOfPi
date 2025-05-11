'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Binary, TreeDeciduous, AlertCircle } from 'lucide-react'; // Using TreeDeciduous for tree icon
import PrimeFactorizationTreeDisplay, { type TreeNode } from './PrimeFactorizationTreeDisplay';

const MAX_FACTORIZATION_INPUT = 10000; // Max number for factorization to keep it performant and displayable
const MIN_FACTORIZATION_INPUT = 2;

// Helper function to check if a number is prime
const isNumberPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

// Helper function to build the factorization tree
const buildFactorizationTreeRecursive = (num: number): TreeNode | null => {
  if (num < MIN_FACTORIZATION_INPUT) return null;

  if (isNumberPrime(num)) {
    return { value: num, isPrime: true };
  }

  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      // 'i' is the smallest prime factor or a small factor
      const child1 = buildFactorizationTreeRecursive(i);
      const child2 = buildFactorizationTreeRecursive(num / i);
      
      // Ensure children are not null if they are expected for composite numbers
      if (child1 && child2) {
         return {
            value: num,
            isPrime: false,
            children: [child1, child2],
          };
      } else {
        // This case might occur if i or num/i is < MIN_FACTORIZATION_INPUT after division
        // For simplicity, if a child branch is too small to factor, treat current num as "leaf" in a sense for display.
        // Or, the problem is if `i` or `num/i` is 1.
        // Let's refine: factors should be >= MIN_FACTORIZATION_INPUT
         if (i >= MIN_FACTORIZATION_INPUT && (num/i) >= MIN_FACTORIZATION_INPUT) {
            // This path was taken above
         } else if (i >= MIN_FACTORIZATION_INPUT) { // num/i is too small
            return { value: num, isPrime: false, children: [buildFactorizationTreeRecursive(i)! , {value: num/i, isPrime: isNumberPrime(num/i)}]};
         } else if ((num/i) >= MIN_FACTORIZATION_INPUT) { // i is too small
             return { value: num, isPrime: false, children: [{value: i, isPrime: isNumberPrime(i)}, buildFactorizationTreeRecursive(num/i)! ]};
         }
         // If both are too small, but num itself is not prime, means it's a product of small primes
         // e.g. 4 -> 2,2. The loop i*i <= num will catch this.
      }
    }
  }
  // If loop finishes, num must be prime (this should ideally be caught by the first isNumberPrime check)
  return { value: num, isPrime: true };
};


export default function PrimeQuarryCard() {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [numberToFactor, setNumberToFactor] = React.useState<number | null>(null);
  const [factorTree, setFactorTree] = React.useState<TreeNode | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null); // Clear error on new input
  };

  const handleSubmit = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) {
      setError("Please enter a valid integer.");
      setNumberToFactor(null);
      setFactorTree(null);
      return;
    }
    if (num < MIN_FACTORIZATION_INPUT) {
      setError(`Please enter a number greater than or equal to ${MIN_FACTORIZATION_INPUT}.`);
      setNumberToFactor(null);
      setFactorTree(null);
      return;
    }
    if (num > MAX_FACTORIZATION_INPUT) {
      setError(`Please enter a number less than or equal to ${MAX_FACTORIZATION_INPUT} for optimal display.`);
      // Allow factorization for slightly larger numbers if user insists, but tree might be big
      // For now, let's enforce the max strictly for display reasons
      setNumberToFactor(null);
      setFactorTree(null);
      return;
    }
    setError(null);
    setNumberToFactor(num);
    setFactorTree(buildFactorizationTreeRecursive(num));
  };
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <TreeDeciduous className="w-8 h-8" /> Prime Factorization Tree
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter an integer (e.g., 36, 120) to see its prime factorization tree.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={`Enter number (${MIN_FACTORIZATION_INPUT}-${MAX_FACTORIZATION_INPUT})`}
            className="max-w-xs text-base"
            aria-label="Number to factorize"
          />
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            <Binary className="mr-2 h-5 w-5" /> Factorize
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 border border-muted rounded-lg bg-muted/20 min-h-[200px] flex justify-center items-start overflow-x-auto">
          {factorTree ? (
            <PrimeFactorizationTreeDisplay rootNode={factorTree} />
          ) : (
            <p className="text-muted-foreground text-center py-10">
              Enter a number and click "Factorize" to see its prime factorization tree.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
