
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Zap, CheckCircle, XCircle, RotateCw, TimerIcon, Trophy } from 'lucide-react';
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import problemsData from '@/data/math-battle-problems.json';
import type { MathBattleProblem } from '@/types';
import AnswerOptionButtons from './AnswerOptionButtons'; // New component for MCQs

const GAME_DURATION_SECONDS = 60;
const MAX_PROBLEMS_PER_GAME = 20; 

export default function MathBattleGame() {
  const [allProblems, setAllProblems] = useState<MathBattleProblem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<MathBattleProblem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);
  const [gamePhase, setGamePhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  const [problemIndex, setProblemIndex] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const loadProblem = useCallback(() => {
    if (problemIndex >= allProblems.length || problemIndex >= MAX_PROBLEMS_PER_GAME) {
      setGamePhase('over');
      return;
    }
    setCurrentProblem(allProblems[problemIndex]);
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswerSubmitted(false);
  }, [problemIndex, allProblems]);
  
  useEffect(() => {
    const problemsOfTypeArithmetic = problemsData.problems.filter(p => p.type === 'arithmetic') as MathBattleProblem[];
    const shuffledProblems = [...problemsOfTypeArithmetic].sort(() => 0.5 - Math.random());
    setAllProblems(shuffledProblems);
  }, []);

  useEffect(() => {
    if (gamePhase === 'playing' && allProblems.length > 0) {
      loadProblem();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, problemIndex, allProblems.length]); // loadProblem is memoized, so only allProblems.length is needed

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gamePhase === 'playing' && timeLeft > 0 && !isAnswerSubmitted) { // Pause timer after submission
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gamePhase === 'playing' && timeLeft === 0) {
      setGamePhase('over');
    }
    return () => clearTimeout(timerId);
  }, [gamePhase, timeLeft, isAnswerSubmitted]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setProblemIndex(0);
    setIsAnswerSubmitted(false);
    setGamePhase('playing');
  };

  const handleOptionSelect = (option: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    handleSubmit(option); // Auto-submit on option select for faster gameplay
  };

  const handleSubmit = (chosenOption: number | null) => {
    if (!currentProblem || chosenOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    let isCorrect = false;
    
    isCorrect = chosenOption === currentProblem.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ message: 'Correct!', type: 'correct' });
    } else {
      setFeedback({ message: `Incorrect. The answer was ${currentProblem.answer}.`, type: 'incorrect' });
    }
    
    // Automatically move to next problem or end game after a short delay
    setTimeout(() => {
      if (problemIndex < allProblems.length - 1 && problemIndex < MAX_PROBLEMS_PER_GAME - 1 && timeLeft > 0) {
        setProblemIndex(prev => prev + 1);
      } else {
        setGamePhase('over');
      }
    }, 1200); // Delay for feedback visibility
  };
  
  const instructions = `
    Test your mental math skills against the clock!
    - Click "Start Game" to begin.
    - You have ${GAME_DURATION_SECONDS} seconds to answer as many questions as possible (up to ${MAX_PROBLEMS_PER_GAME}).
    - Solve the math problem shown and click one of the answer choices.
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
              <p id="problem-text" className="text-2xl sm:text-3xl font-mono text-foreground">
                {currentProblem.question} = ?
              </p>
            </Card>
            
            <AnswerOptionButtons
              options={currentProblem.options}
              onSelectOption={handleOptionSelect}
              disabled={isAnswerSubmitted}
              correctAnswer={isAnswerSubmitted ? currentProblem.answer : null}
              selectedAnswer={selectedOption}
            />

            {feedback && isAnswerSubmitted && ( // Only show feedback after submission
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
            <p className="text-muted-foreground">You attempted {problemIndex >= MAX_PROBLEMS_PER_GAME || problemIndex >= allProblems.length ? Math.min(problemIndex, MAX_PROBLEMS_PER_GAME) : problemIndex +1 } questions.</p>
            <Button onClick={startGame} size="lg" variant="outline">
              <RotateCw className="mr-2 h-5 w-5" /> Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
