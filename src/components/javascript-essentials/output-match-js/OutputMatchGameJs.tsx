
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeSnippetJs from './CodeSnippetJs';
import OptionsJs from './OptionsJs';
import FeedbackJs from './FeedbackJs';
import outputMatchQuestionsJs from '@/data/javascript-foundations/outputMatchQuestionsJs.json';
import type { OutputMatchQuestionJS } from '@/types/javascript-games';
import { Target, RefreshCcw, Check, ArrowRight, Code } from 'lucide-react';

const TOTAL_QUESTIONS = Math.min(5, outputMatchQuestionsJs.length); 

export default function OutputMatchGameJs() {
  const [questions, setQuestions] = useState<OutputMatchQuestionJS[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const shuffled = [...outputMatchQuestionsJs].sort(() => 0.5 - Math.random());
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
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted || !currentQuestion) return;

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
    }
  };
  
  const handleRestartGame = () => {
    const shuffled = [...outputMatchQuestionsJs].sort(() => 0.5 - Math.random());
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
            <Code className="w-7 h-7 text-yellow-500" /> JS Output Match
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
          <Code className="w-7 h-7 text-yellow-500" /> JavaScript Output Match
        </CardTitle>
        <CardDescription>
          Match the JavaScript code snippet to its correct console output.
          Question {currentQuestionIndex + 1} of {questions.length}. Score: {score}/{questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CodeSnippetJs code={currentQuestion.code} />
        <OptionsJs
          options={currentQuestion.options}
          selectedOption={selectedOption}
          correctOption={isSubmitted ? currentQuestion.correct : null}
          onSelect={handleOptionSelect}
          disabled={isSubmitted}
        />

        {showFeedback && isSubmitted && (
          <FeedbackJs
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
