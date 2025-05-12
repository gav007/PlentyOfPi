
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Binary, CheckCircle, XCircle, AlertTriangle, List, Forward } from 'lucide-react'; // Changed ListNumbers to List
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import { isPrime, getFactors, getNextPrimes } from '@/lib/primeUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_INPUT_VALUE = 1000000; // Max 1 million for performance
const MAX_NEXT_PRIMES_COUNT = 10;

export default function PrimeTesterCard() {
  const [inputValue, setInputValue] = useState<string>('17');
  const [numberToTest, setNumberToTest] = useState<number | null>(17);
  const [result, setResult] = useState<{
    isPrime: boolean;
    factors: number[];
    nextPrimes: number[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setResult(null); // Clear previous results on new input
    setError(null);
  };

  const handleSubmit = useCallback(() => {
    setError(null);
    setResult(null);
    const num = parseInt(inputValue, 10);

    if (isNaN(num)) {
      setError('Please enter a valid integer.');
      setNumberToTest(null);
      return;
    }
    if (num < 0) {
      setError('Please enter a non-negative integer.');
      setNumberToTest(null);
      return;
    }
    if (num > MAX_INPUT_VALUE) {
      setError(`Number too large. Please enter a number up to ${MAX_INPUT_VALUE}.`);
      setNumberToTest(null);
      return;
    }
    
    setNumberToTest(num);
    const primeStatus = isPrime(num);
    const factorsList = getFactors(num);
    const nextPrimesList = getNextPrimes(num, MAX_NEXT_PRIMES_COUNT);

    setResult({
      isPrime: primeStatus,
      factors: factorsList,
      nextPrimes: nextPrimesList,
    });
  }, [inputValue]);

  const instructions = `
    Enter an integer (up to ${MAX_INPUT_VALUE}) into the input field.
    Click "Test Number" to see if it's prime, find its factors, and view the next ${MAX_NEXT_PRIMES_COUNT} prime numbers after it.
    The tool uses trial division for factorization and primality testing.
  `;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Binary className="w-8 h-8" />
          Prime Number Tester
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Explore prime numbers, find factors, and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HowToUseToggle instructions={instructions} title="How to Use Prime Tester"/>
        <div className="space-y-2">
          <Label htmlFor="number-input" className="font-semibold">Enter an integer:</Label>
          <div className="flex items-center gap-2">
            <Input
              id="number-input"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={`e.g., 17, 100 (max ${MAX_INPUT_VALUE})`}
              className="text-lg"
            />
            <Button onClick={handleSubmit} className="px-6 text-md">
              Test Number
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && numberToTest !== null && (
          <Card className="bg-muted/30 p-4 space-y-4">
            <h3 className="text-xl font-semibold text-center text-primary">
              Results for {numberToTest}
            </h3>
            
            <div className={`flex items-center gap-2 p-3 rounded-md text-lg ${result.isPrime ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
              {result.isPrime ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{numberToTest} is {result.isPrime ? 'a prime number' : 'not a prime number'}.</span>
            </div>

            <div>
              <h4 className="font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                <List className="w-4 h-4"/>Factors:
              </h4>
              <p className="text-foreground pl-2">
                {result.factors.length > 0 ? result.factors.join(', ') : 'None (except 1 and itself if prime, or it is 0 or 1)'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                <Forward className="w-4 h-4"/>Next {MAX_NEXT_PRIMES_COUNT} Primes after {numberToTest}:
              </h4>
              <p className="text-foreground pl-2">
                {result.nextPrimes.join(', ')}
              </p>
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
