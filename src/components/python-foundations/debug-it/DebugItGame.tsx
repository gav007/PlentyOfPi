
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PythonSandbox from '@/components/python-foundations/PythonSandbox';
import ExpectedOutput from './ExpectedOutput';
import Feedback from '@/components/python-foundations/output-match/Feedback';
import debugItChallenges from '@/data/python-foundations/debugItChallenges.json';
import type { DebugItChallenge } from '@/types/python-games';
import { Wrench, RefreshCcw, Check, X, Lightbulb, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TOTAL_CHALLENGES = Math.min(5, debugItChallenges.length); 

export default function DebugItGame() {
  const [challenges, setChallenges] = useState<DebugItChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [sandboxKey, setSandboxKey] = useState(Date.now()); 
  const [actualOutput, setActualOutput] = useState('');

  useEffect(() => {
    const shuffled = [...debugItChallenges].sort(() => 0.5 - Math.random());
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
    }
  }, [currentChallengeIndex, challenges]);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleSandboxOutputUpdate = (outputFromSandbox: string, error: string | null) => {
    if (error) {
      setActualOutput(`Error: ${error}`);
    } else {
      setActualOutput(outputFromSandbox);
    }
  };

  const handleCompareOutput = () => {
    if (isSubmitted || !currentChallenge) return;

    const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
    const userOutputNormalized = normalize(actualOutput);
    const expectedOutputNormalized = normalize(currentChallenge.expectedOutput);
    
    const correct = userOutputNormalized === expectedOutputNormalized;

    setIsCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
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
    const shuffled = [...debugItChallenges].sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, TOTAL_CHALLENGES));
    setCurrentChallengeIndex(0);
    setScore(0);
  };

  if (challenges.length === 0 || !currentChallenge) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wrench className="w-7 h-7" /> Debug It! Puzzles
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
          <Wrench className="w-7 h-7" /> Debug It! Puzzles
        </CardTitle>
        <CardDescription>
          Fix the broken Python code to match the expected output. 
          Challenge {currentChallengeIndex + 1} of {challenges.length}. Score: {score}/{challenges.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="font-semibold">Challenge:</AlertTitle>
            <AlertDescription>{currentChallenge.description}</AlertDescription>
        </Alert>

        <PythonSandbox
          key={sandboxKey}
          initialCode={currentChallenge.initialCode}
          onRunComplete={handleSandboxOutputUpdate}
        />
        <ExpectedOutput output={currentChallenge.expectedOutput} />

        {showFeedback && isSubmitted && (
          <Feedback
            isCorrect={!!isCorrect}
            correctAnswer={currentChallenge.expectedOutput} // Show expected output if wrong
            explanation={isCorrect ? "Great job debugging!" : currentChallenge.description || "Keep trying! Check for logical errors or syntax issues."}
          />
        )}
        
        {isSubmitted && showSolution && (
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
           {isSubmitted && (
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
