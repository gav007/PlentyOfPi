
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeBlockJs from './CodeBlockJs';
import FeedbackJs from '@/components/javascript-essentials/output-match-js/FeedbackJs'; // Reusing FeedbackJs
import syntaxSpotterProblemsJs from '@/data/javascript-foundations/syntaxSpotterProblemsJs.json';
import type { SyntaxSpotterProblemJS } from '@/types/javascript-games';
import { SearchCode, RefreshCcw, Check, ArrowRight, Code } from 'lucide-react';

const TOTAL_PROBLEMS = Math.min(5, syntaxSpotterProblemsJs.length);

export default function SyntaxSpotterGameJs() {
  const [problems, setProblems] = useState<SyntaxSpotterProblemJS[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const shuffled = [...syntaxSpotterProblemsJs].sort(() => 0.5 - Math.random());
    setProblems(shuffled.slice(0, TOTAL_PROBLEMS));
    setCurrentProblemIndex(0);
    setSelectedLineIndex(null);
    setIsSubmitted(false);
    setScore(0);
    setShowFeedback(false);
  }, []);

  const currentProblem = problems[currentProblemIndex];

  const handleLineSelect = (lineIndex: number) => {
    if (isSubmitted) return;
    setSelectedLineIndex(lineIndex);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    if (selectedLineIndex === null || isSubmitted || !currentProblem) return;

    setIsSubmitted(true);
    setShowFeedback(true);
    if (selectedLineIndex === currentProblem.errorLineIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prevIndex => prevIndex + 1);
      setSelectedLineIndex(null);
      setIsSubmitted(false);
      setShowFeedback(false);
    }
  };
  
  const handleRestartGame = () => {
    const shuffled = [...syntaxSpotterProblemsJs].sort(() => 0.5 - Math.random());
    setProblems(shuffled.slice(0, TOTAL_PROBLEMS));
    setCurrentProblemIndex(0);
    setSelectedLineIndex(null);
    setIsSubmitted(false);
    setScore(0);
    setShowFeedback(false);
  };

  if (problems.length === 0 || !currentProblem) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Code className="w-7 h-7 text-yellow-500" /> JS Syntax Spotter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading problems...</p>
        </CardContent>
      </Card>
    );
  }
  
  const isGameOver = currentProblemIndex >= problems.length -1 && isSubmitted;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Code className="w-7 h-7 text-yellow-500" /> JavaScript Syntax Spotter
        </CardTitle>
        <CardDescription>
          Find the line with a syntax error in the JavaScript code. 
          Problem {currentProblemIndex + 1} of {problems.length}. Score: {score}/{problems.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CodeBlockJs
          lines={currentProblem.lines}
          errorLineIndex={isSubmitted ? currentProblem.errorLineIndex : undefined}
          selectedLineIndex={selectedLineIndex}
          onLineSelect={handleLineSelect}
          disabled={isSubmitted}
        />

        {showFeedback && isSubmitted && (
          <FeedbackJs
            isCorrect={selectedLineIndex === currentProblem.errorLineIndex}
            correctAnswer={`Line ${currentProblem.errorLineIndex + 1}`}
            explanation={currentProblem.explanation}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-6 border-t">
          {!isSubmitted && (
            <Button onClick={handleSubmit} disabled={selectedLineIndex === null} className="w-full sm:w-auto">
              <Check className="mr-2 h-5 w-5" /> Submit Answer
            </Button>
          )}
          {isSubmitted && !isGameOver && (
            <Button onClick={handleNextProblem} className="w-full sm:w-auto">
              Next Problem <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {isGameOver && (
            <div className="text-center w-full space-y-3">
                <p className="text-xl font-semibold text-primary">
                    Game Over! Your final score: {score} / {problems.length}
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
