'use client';

import type { JSQuizItem, JSQuizQuestion } from '@/types/javascript-lessons'; // Adjusted import
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle, XCircle, RotateCcw, CodeSquare } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface JSQuizPageContentProps {
  quiz: JSQuizItem;
  moduleTitle: string;
  prevLink: { href: string; title: string } | null;
  nextLink: { href: string; title: string } | null;
}

export default function JSQuizPageContent({ quiz, moduleTitle, prevLink, nextLink }: JSQuizPageContentProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowFeedback({});
  }, [quiz]);

  const handleOptionChange = (questionIndex: number, optionKey: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionKey }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let currentScore = 0;
    const feedbackVisibility: Record<number, boolean> = {};
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        currentScore++;
      }
      feedbackVisibility[index] = true;
    });
    setScore(currentScore);
    setShowFeedback(feedbackVisibility);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowFeedback({});
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardDescription className="text-sm text-primary">{moduleTitle}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-yellow-500" /> Quiz: {quiz.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-6 space-y-6">
        {quiz.questions.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg bg-muted/20 shadow-sm">
            <p className="font-semibold mb-3 text-foreground">{index + 1}. {q.question}</p>
            <RadioGroup
              value={selectedAnswers[index]}
              onValueChange={(value) => handleOptionChange(index, value)}
              disabled={submitted}
              className="space-y-2"
            >
              {Object.entries(q.options).map(([key, text]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`q${index}-opt${key}`} />
                  <Label htmlFor={`q${index}-opt${key}`} className="font-normal text-sm text-muted-foreground cursor-pointer">
                    {text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {submitted && showFeedback[index] && (
              <Alert
                variant={selectedAnswers[index] === q.answer ? "default" : "destructive"}
                className={cn(
                  "mt-3 text-xs",
                  selectedAnswers[index] === q.answer
                    ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400"
                    : "bg-destructive/10 border-destructive/50 text-destructive"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {selectedAnswers[index] === q.answer ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <AlertTitle className="font-semibold">
                    {selectedAnswers[index] === q.answer ? "Correct!" : `Incorrect. Correct answer: ${q.answer} (${q.options[q.answer]})`}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-1">{q.feedback}</AlertDescription>
              </Alert>
            )}
          </div>
        ))}

        {!submitted && (
          <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}>
            Submit Answers
          </Button>
        )}

        {submitted && (
          <div className="mt-6 p-4 border-t text-center space-y-3">
            <h3 className="text-xl font-semibold text-primary">Quiz Complete!</h3>
            <p className="text-lg">Your score: {score} / {quiz.questions.length} ({((score / quiz.questions.length) * 100).toFixed(0)}%)</p>
            <Button onClick={handleRetry} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Retry Quiz
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          {prevLink ? (
            <Button asChild variant="outline" size="sm">
              <Link href={prevLink.href}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Prev: {prevLink.title.substring(0, 20)}{prevLink.title.length > 20 ? '...' : ''}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {nextLink ? (
            <Button asChild variant="default" size="sm">
              <Link href={nextLink.href}>
                Next: {nextLink.title.substring(0, 20)}{nextLink.title.length > 20 ? '...' : ''} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href={`/lessons/javascript-essentials/`}>
                Module Overview <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
