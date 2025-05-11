
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Gem, Hammer, CheckSquare } from 'lucide-react';

export default function ExplanationPanelPrime() {
  return (
    <Card className="border-dashed border-accent bg-accent/10 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Understanding Prime Quarry
        </CardTitle>
        <CardDescription className="text-accent-foreground/90">
          Learn how to identify prime numbers by chipping away at composites!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-accent-foreground/80">
        <div>
          <h3 className="font-semibold text-accent-foreground flex items-center gap-1 mb-1">
            <Gem className="w-4 h-4 text-primary" /> What is a Prime Number?
          </h3>
          <div className="pl-6 bg-background/30 p-3 rounded-md space-y-1">
            <p>
              A prime number is a whole number greater than 1 that has only two divisors: 1 and itself.
            </p>
            <p>
              Examples: 2, 3, 5, 7, 11, 13...
            </p>
            <p className="italic text-xs">
              Note: The number 1 is not a prime number. The smallest prime number is 2.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-accent-foreground flex items-center gap-1 mb-1">
            <Hammer className="w-4 h-4 text-destructive" /> What is a Composite Number?
          </h3>
          <div className="pl-6 bg-background/30 p-3 rounded-md space-y-1">
            <p>
              A composite number is a whole number greater than 1 that has more than two divisors (it can be divided evenly by numbers other than 1 and itself).
            </p>
            <p>
              Examples: 4 (divisors: 1, 2, 4), 6 (divisors: 1, 2, 3, 6), 9 (divisors: 1, 3, 9)...
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-accent-foreground flex items-center gap-1 mb-1">
            <CheckSquare className="w-4 h-4 text-green-500" /> How to Play Prime Quarry
          </h3>
          <div className="pl-6 bg-background/30 p-3 rounded-md space-y-2">
            <p>
              <strong>1. Select a Divisor:</strong> From the toolbar, choose a number you want to use to test divisibility (e.g., 2, 3, 5).
            </p>
            <p>
              <strong>2. Chip Away Rocks:</strong> Click on the numbered "rocks" in the grid.
              If a rock's number is divisible by your selected divisor (and isn't the divisor itself), it's a composite number and will be "chipped" (marked or greyed out).
            </p>
            <p>
              <strong>Example:</strong> If you select '2' as the divisor, clicking on rock '4' will chip it because 4 is divisible by 2. Clicking on rock '6' will also chip it. Rock '2' itself won't be chipped by divisor '2'.
            </p>
            <p>
              <strong>3. Identify Primes:</strong> The rocks that remain unchipped after you've tried various divisors are your prime number candidates.
            </p>
            <p>
              <strong>4. Check Your Work:</strong> Click the "Check My Primes" button. The game will then highlight the true prime numbers.
              Correctly chipped composites remain chipped. Composites you missed will be indicated.
            </p>
            <p className="font-medium text-accent-foreground/90 mt-2">
              The goal is to chip away all composite numbers, leaving only the primes untouched!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
