
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeBlock from './CodeBlock';
import Feedback from '@/components/python-foundations/output-match/Feedback'; // Reusing Feedback component
import syntaxSpotterProblems from '@/data/python-foundations/syntaxSpotterProblems.json';
import type { SyntaxSpotterProblem } from '@/types/python-games';
import { SearchCode, RefreshCcw, Check, X } from 'lucide-react';

const TOTAL_QUESTIONS = Math.min(5, syntaxSpotterProblems.length); // Max 5 problems or total available

export default function SyntaxSpotterGame() {
  const [problems, setProblems] = useState<SyntaxSpotterProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const shuffled = [...syntaxSpotterProblems].sort(() => 0.5 - Math.random());
    setProblems(shuffled.slice(0, TOTAL_QUESTIONS));
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
    if (selectedLineIndex === null || isSubmitted) return;

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
    const shuffled = [...syntaxSpotterProblems].sort(() => 0.5 - Math.random());
    setProblems(shuffled.slice(0, TOTAL_QUESTIONS));
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
            <SearchCode className="w-7 h-7" /> Syntax Spotter Game
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
          <SearchCode className="w-7 h-7" /> Syntax Spotter Game
        </CardTitle>
        <CardDescription>
          Find the line with a syntax error in the Python code. 
          Problem {currentProblemIndex + 1} of {problems.length}. Score: {score}/{problems.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CodeBlock
          lines={currentProblem.lines}
          errorLineIndex={isSubmitted ? currentProblem.errorLineIndex : undefined}
          selectedLineIndex={selectedLineIndex}
          onLineSelect={handleLineSelect}
          disabled={isSubmitted}
        />

        {showFeedback && isSubmitted && (
          <Feedback
            isCorrect={selectedLineIndex === currentProblem.errorLineIndex}
            correctAnswer={`Line ${currentProblem.errorLineIndex + 1}`} // User-friendly line number
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

// Helper to define an ArrowRight component if not available
const ArrowRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
