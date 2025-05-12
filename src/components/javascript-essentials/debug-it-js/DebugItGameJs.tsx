
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JSCodeSandbox from '@/components/javascript-essentials/JSCodeSandbox';
import ExpectedOutputJs from './ExpectedOutputJs';
import FeedbackJs from '@/components/javascript-essentials/output-match-js/FeedbackJs'; // Reusing FeedbackJs
import debugItChallengesJs from '@/data/javascript-foundations/debugItChallengesJs.json';
import type { DebugItChallengeJS } from '@/types/javascript-games';
import { Wrench, RefreshCcw, Check, Lightbulb, ArrowRight, Code } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TOTAL_CHALLENGES = Math.min(3, debugItChallengesJs.length); 

export default function DebugItGameJs() {
  const [challenges, setChallenges] = useState<DebugItChallengeJS[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [sandboxKey, setSandboxKey] = useState(Date.now()); 
  const [actualOutput, setActualOutput] = useState('');
  const [actualError, setActualError] = useState<string | null>(null);

  useEffect(() => {
    const shuffled = [...debugItChallengesJs].sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, TOTAL_CHALLENGES));
  }, []);
  
  useEffect(() => {
    if (challenges.length > 0 && challenges[currentChallengeIndex]) {
      setSandboxKey(Date.now()); 
      setIsSubmitted(false);
      setIsCorrect(null);
      setShowFeedback(false);
      setShowSolution(false);
      setActualOutput('');
      setActualError(null);
    }
  }, [currentChallengeIndex, challenges]);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleSandboxRunComplete = (stdout: string, stderr: string | null) => {
    setActualOutput(stdout.trim());
    setActualError(stderr);
  };

  const handleCompareOutput = () => {
    if (isSubmitted || !currentChallenge) return;

    // In JS sandbox, errors might prevent output. Prioritize error state.
    if (actualError) {
        setIsCorrect(false); // If there's a runtime error, it's not the expected output.
    } else {
        const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
        const userOutputNormalized = normalize(actualOutput);
        const expectedOutputNormalized = normalize(currentChallenge.expectedOutput);
        setIsCorrect(userOutputNormalized === expectedOutputNormalized);
    }
    
    if (isCorrect) { // Note: isCorrect state might be stale here, check directly
        const userOutputNormalized = normalize(actualOutput);
        const expectedOutputNormalized = normalize(currentChallenge.expectedOutput);
        if (userOutputNormalized === expectedOutputNormalized && !actualError) {
            setScore(prevScore => prevScore + 1);
        }
    }

    setIsSubmitted(true);
    setShowFeedback(true);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handleRestartGame = () => {
    const shuffled = [...debugItChallengesJs].sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, TOTAL_CHALLENGES));
    setCurrentChallengeIndex(0);
    setScore(0);
  };

  if (challenges.length === 0 || !currentChallenge) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Code className="w-7 h-7 text-yellow-500" /> JS Debug It!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading challenges...</p>
        </CardContent>
      </Card>
    );
  }
  
  const isGameOver = currentChallengeIndex >= challenges.length -1 && isSubmitted;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Code className="w-7 h-7 text-yellow-500" /> JavaScript Debug It!
        </CardTitle>
        <CardDescription>
          Fix the broken JavaScript code to match the expected console output. 
          Challenge {currentChallengeIndex + 1} of {challenges.length}. Score: {score}/{challenges.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="font-semibold">Challenge:</AlertTitle>
            <AlertDescription>{currentChallenge.description}</AlertDescription>
        </Alert>

        <JSCodeSandbox
          key={sandboxKey}
          initialCode={currentChallenge.initialCode}
          onRunComplete={handleSandboxRunComplete}
        />
        <ExpectedOutputJs output={currentChallenge.expectedOutput} />

        {showFeedback && isSubmitted && (
          <FeedbackJs
            isCorrect={!!isCorrect && !actualError} // Consider error as incorrect
            correctAnswer={currentChallenge.expectedOutput}
            explanation={
                actualError 
                ? `Your code produced an error: ${actualError}`
                : isCorrect 
                    ? "Great job debugging!" 
                    : "Output does not match. Keep trying! Check for logical errors or ensure all requirements are met."
            }
          />
        )}
        
        {isSubmitted && showSolution && currentChallenge.solution && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
                <h3 className="text-md font-semibold mb-2 text-primary">Example Solution:</h3>
                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-xs leading-relaxed">
                    <code>{currentChallenge.solution}</code>
                </pre>
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 pt-6 border-t">
          {!isSubmitted && (
            <Button onClick={handleCompareOutput} className="w-full sm:w-auto">
              <Check className="mr-2 h-5 w-5" /> Compare Output
            </Button>
          )}
          {isSubmitted && !isGameOver && (
            <Button onClick={handleNextChallenge} className="w-full sm:w-auto">
              Next Challenge <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
           {isSubmitted && currentChallenge.solution && (
            <Button onClick={() => setShowSolution(s => !s)} variant="ghost" size="sm" className="text-xs">
                <Lightbulb className="mr-1 h-4 w-4" /> {showSolution ? "Hide" : "Show"} Solution
            </Button>
           )}
          {isGameOver && (
            <div className="text-center w-full space-y-3">
                <p className="text-xl font-semibold text-primary">
                    Game Over! Your final score: {score} / {challenges.length}
                </p>
                <Button onClick={handleRestartGame} variant="outline" className="w-full sm:w-auto">
                    <RefreshCcw className="mr-2 h-5 w-5" /> Play Again
                </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
