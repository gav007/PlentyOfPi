
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Zap, CheckCircle, XCircle, RotateCw, TimerIcon, Trophy } from 'lucide-react';
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import problemsData from '@/data/math-battle-problems.json';
import * as math from 'mathjs';

interface Problem {
  id: string;
  question: string;
  answer: number;
  type: 'arithmetic' | 'gcd' | 'algebra_simple';
}

const GAME_DURATION_SECONDS = 60; // 1 minute game
const MAX_PROBLEMS_PER_GAME = 20; // Or until timer runs out

export default function MathBattleGame() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);
  const [gamePhase, setGamePhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  const [problemIndex, setProblemIndex] = useState(0);

  const loadProblem = useCallback(() => {
    if (problemIndex >= problems.length || problemIndex >= MAX_PROBLEMS_PER_GAME) {
        setGamePhase('over');
        return;
    }
    setCurrentProblem(problems[problemIndex]);
    setUserAnswer('');
    setFeedback(null);
  }, [problemIndex, problems]);
  
  useEffect(() => {
    // Shuffle problems on initial load or when game restarts
    if (gamePhase === 'idle' || gamePhase === 'over') {
        const shuffledProblems = [...problemsData.problems].sort(() => 0.5 - Math.random()) as Problem[];
        setProblems(shuffledProblems);
        setProblemIndex(0); // Reset problem index for new game
    }
  }, [gamePhase]);


  useEffect(() => {
    if (gamePhase === 'playing') {
      loadProblem();
    }
  }, [gamePhase, problemIndex, loadProblem]); // Added problemIndex and loadProblem

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gamePhase === 'playing' && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gamePhase === 'playing' && timeLeft === 0) {
      setGamePhase('over');
    }
    return () => clearTimeout(timerId);
  }, [gamePhase, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setProblemIndex(0); // Ensure problem index is reset
    setGamePhase('playing');
    // loadProblem will be called by the useEffect watching gamePhase and problemIndex
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (!currentProblem || userAnswer.trim() === '') return;

    let isCorrect = false;
    const userAnswerNum = parseFloat(userAnswer);

    if (isNaN(userAnswerNum)) {
        setFeedback({ message: `Invalid input. Please enter a number. Correct answer was ${currentProblem.answer}.`, type: 'incorrect' });
    } else {
        isCorrect = Math.abs(userAnswerNum - currentProblem.answer) < 0.001; // Tolerance for float comparison
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback({ message: 'Correct!', type: 'correct' });
        } else {
            setFeedback({ message: `Incorrect. The answer was ${currentProblem.answer}.`, type: 'incorrect' });
        }
    }
    
    // Move to next problem or end game
    if (problemIndex < problems.length - 1 && problemIndex < MAX_PROBLEMS_PER_GAME -1) {
        setTimeout(() => {
             setProblemIndex(prev => prev + 1);
             // loadProblem(); // loadProblem is now a dependency of useEffect and will be called
        }, 1000); // Short delay to show feedback
    } else {
        setTimeout(() => setGamePhase('over'), 1000);
    }
  };
  
  const instructions = `
    Test your mental math skills against the clock!
    - Click "Start Game" to begin.
    - You have ${GAME_DURATION_SECONDS} seconds to answer as many questions as possible.
    - Solve the math problem shown and enter your answer.
    - Press Enter or click "Submit" to check your answer.
    - Correct answers increase your score.
    - Good luck!
  `;

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Zap className="w-8 h-8" />
          Math Battle
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Quick-fire math problems. How many can you solve?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HowToUseToggle instructions={instructions} title="How to Play Math Battle" />

        {gamePhase === 'idle' && (
          <Button onClick={startGame} size="lg" className="w-full text-lg">
            Start Game
          </Button>
        )}

        {gamePhase === 'playing' && currentProblem && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" /> Score: {score}
              </div>
              <div className="flex items-center gap-2 text-destructive">
                <TimerIcon className="w-5 h-5" /> Time: {timeLeft}s
              </div>
            </div>
            <Card className="p-6 bg-muted/30 text-center">
              <Label htmlFor="problem-text" className="sr-only">Current Problem</Label>
              <p id="problem-text" className="text-2xl font-mono text-foreground">
                {currentProblem.question} = ?
              </p>
            </Card>
            <div className="flex items-center gap-2">
              <Label htmlFor="user-answer" className="sr-only">Your Answer</Label>
              <Input
                id="user-answer"
                type="number"
                value={userAnswer}
                onChange={handleAnswerChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Your answer"
                className="text-lg flex-grow"
                autoFocus
              />
              <Button onClick={handleSubmit} className="px-6 text-md">
                Submit
              </Button>
            </div>
            {feedback && (
              <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className={feedback.type === 'correct' ? 'bg-green-500/10 border-green-500 text-green-700' : ''}>
                {feedback.type === 'correct' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{feedback.type === 'correct' ? 'Correct!' : 'Incorrect!'}</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {gamePhase === 'over' && (
          <div className="text-center space-y-4 p-6 bg-primary/10 rounded-lg">
            <h3 className="text-2xl font-bold text-primary">Game Over!</h3>
            <p className="text-xl text-foreground">Your final score: <span className="font-bold">{score}</span></p>
            <p className="text-muted-foreground">You answered {problemIndex} questions.</p>
            <Button onClick={startGame} size="lg" variant="outline">
              <RotateCw className="mr-2 h-5 w-5" /> Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
