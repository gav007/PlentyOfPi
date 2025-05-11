
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RockGrid from './RockGrid';
import DivisorToolbar from './DivisorToolbar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, RefreshCw, Unplug } from 'lucide-react';

const INITIAL_MAX_NUMBER = 50; // Max number for rocks
const MAX_POSSIBLE_DIVISOR = 10; // For the toolbar

export default function PrimeQuarryCard() {
  const [maxNumber, setMaxNumber] = useState(INITIAL_MAX_NUMBER);
  const [tiles, setTiles] = useState<number[]>([]);
  const [chipped, setChipped] = useState<Set<number>>(new Set());
  const [selectedDivisor, setSelectedDivisor] = useState<number | null>(null);
  const [primesChecked, setPrimesChecked] = useState(false);
  const [revealedPrimes, setRevealedPrimes] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  const generateTiles = useCallback((n: number) => {
    return Array.from({ length: n - 1 }, (_, i) => i + 2);
  }, []);

  const resetGame = useCallback(() => {
    setTiles(generateTiles(maxNumber));
    setChipped(new Set());
    setSelectedDivisor(null);
    setPrimesChecked(false);
    setRevealedPrimes(new Set());
    setMessage(null);
  }, [maxNumber, generateTiles]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleDivisorSelect = (divisor: number) => {
    setSelectedDivisor(divisor);
    setPrimesChecked(false); // Allow chipping again if a new divisor is selected after checking
    setMessage(null);
  };

  const handleRockClick = (tile: number) => {
    if (primesChecked) return; // Don't allow chipping after checking primes until reset or new divisor

    if (selectedDivisor !== null) {
      if (tile % selectedDivisor === 0 && tile !== selectedDivisor) {
        setChipped(prev => new Set(prev).add(tile));
      } else if (tile % selectedDivisor !== 0) {
        // Optional: feedback if they click a rock not divisible by the selected divisor
        setMessage(`Rock ${tile} is not divisible by ${selectedDivisor}.`);
        setTimeout(() => setMessage(null), 2000);
      } else if (tile === selectedDivisor) {
        setMessage(`You can't chip a rock with itself as the divisor.`);
        setTimeout(() => setMessage(null), 2000);
      }
    } else {
      setMessage('Please select a divisor first.');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleCheckPrimes = () => {
    const actualPrimes = new Set<number>();
    tiles.forEach(tile => {
      if (isNumberPrime(tile)) {
        actualPrimes.add(tile);
      }
    });
    setRevealedPrimes(actualPrimes);
    setPrimesChecked(true);

    const correctlyIdentifiedNonPrimes = tiles.filter(t => !actualPrimes.has(t) && chipped.has(t)).length;
    const missedNonPrimes = tiles.filter(t => !actualPrimes.has(t) && !chipped.has(t)).length;
    const totalNonPrimes = tiles.length - actualPrimes.size;
    
    let scoreMessage = "";
    if (missedNonPrimes === 0 && correctlyIdentifiedNonPrimes === totalNonPrimes) {
      scoreMessage = "Excellent! You've correctly identified all primes and chipped all composites.";
    } else if (missedNonPrimes > 0) {
      scoreMessage = `Good effort! You missed ${missedNonPrimes} composite number(s). True primes are now highlighted.`;
    } else {
      scoreMessage = `Well done! True primes are now highlighted.`;
    }
    setMessage(scoreMessage);
  };
  
  const isNumberPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const possibleDivisors = Array.from({ length: Math.min(MAX_POSSIBLE_DIVISOR, Math.floor(Math.sqrt(maxNumber))) -1  }, (_, i) => i + 2);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Unplug className="w-8 h-8" /> Prime Quarry
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Select a divisor, then click on rocks to chip away composite numbers. Unchipped rocks are your prime candidates!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DivisorToolbar
          divisors={possibleDivisors}
          selectedDivisor={selectedDivisor}
          onSelectDivisor={handleDivisorSelect}
          disabled={primesChecked}
        />
        
        {message && (
          <Alert className={primesChecked && message.includes("Excellent") ? "border-green-500 bg-green-500/10 text-green-700" : ""}>
            <AlertTitle>{primesChecked ? "Results" : "Hint"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <RockGrid
          tiles={tiles}
          chipped={chipped}
          onRockClick={handleRockClick}
          selectedDivisor={selectedDivisor}
          primesChecked={primesChecked}
          revealedPrimes={revealedPrimes}
        />
        <div className="flex justify-center space-x-4 mt-6">
          <Button onClick={handleCheckPrimes} disabled={primesChecked} variant="secondary">
            <CheckCircle className="mr-2 h-5 w-5" /> Check My Primes
          </Button>
          <Button onClick={resetGame} variant="outline">
            <RefreshCw className="mr-2 h-5 w-5" /> Reset Quarry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
