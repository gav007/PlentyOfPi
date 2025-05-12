
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeSnippet from './CodeSnippet';
import Options from './Options';
import Feedback from './Feedback';
import outputMatchQuestions from '@/data/python-foundations/outputMatchQuestions.json';
import type { OutputMatchQuestion } from '@/types/python-games';
import { Target, RefreshCcw, Check, X } from 'lucide-react';

const TOTAL_QUESTIONS = Math.min(10, outputMatchQuestions.length); // Max 10 questions or total available

export default function OutputMatchGame() {
  const [questions, setQuestions] = useState<OutputMatchQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Shuffle questions and pick a subset
    const shuffled = [...outputMatchQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, TOTAL_QUESTIONS));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowFeedback(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setShowFeedback(false); // Hide feedback when a new option is selected before submitting
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    setIsSubmitted(true);
    setShowFeedback(true);
    if (selectedOption === currentQuestion.correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowFeedback(false);
    } else {
      // Game over
    }
  };

  const handleRestartGame = () => {
    const shuffled = [...outputMatchQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, TOTAL_QUESTIONS));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowFeedback(false);
  };

  if (questions.length === 0 || !currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Target className="w-7 h-7" /> Output Match Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading questions...</p>
        </CardContent>
      </Card>
    );
  }

  const isGameOver = currentQuestionIndex >= questions.length -1 && isSubmitted;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Target className="w-7 h-7" /> Output Match Challenge
        </CardTitle>
        <CardDescription>
          Test your understanding of Python execution by matching code snippets to their correct output.
          Question {currentQuestionIndex + 1} of {questions.length}. Score: {score}/{questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CodeSnippet code={currentQuestion.code} />
        <Options
          options={currentQuestion.options}
          selectedOption={selectedOption}
          correctOption={isSubmitted ? currentQuestion.correct : null}
          onSelect={handleOptionSelect}
          disabled={isSubmitted}
        />

        {showFeedback && isSubmitted && (
          <Feedback
            isCorrect={selectedOption === currentQuestion.correct}
            correctAnswer={currentQuestion.correct}
            explanation={currentQuestion.explanation}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-6 border-t">
          {!isSubmitted && (
            <Button onClick={handleSubmit} disabled={!selectedOption} className="w-full sm:w-auto">
              <Check className="mr-2 h-5 w-5" /> Submit Answer
            </Button>
          )}
          {isSubmitted && !isGameOver && (
            <Button onClick={handleNextQuestion} className="w-full sm:w-auto">
              Next Question <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {isGameOver && (
             <div className="text-center w-full space-y-3">
              <p className="text-xl font-semibold text-primary">
                Game Over! Your final score: {score} / {questions.length}
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
