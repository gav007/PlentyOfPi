
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
import AnswerOptionButtons from './AnswerOptionButtons';
import { cn } from '@/lib/utils'; // Added import for cn

const GAME_DURATION_SECONDS = 60;
const MAX_PROBLEMS_PER_GAME = 10; 

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

  useEffect(() => {
     setAllProblems(problemsData.problems.filter(p => p.type === 'arithmetic') as MathBattleProblem[]);
  }, []);

  const getValidProblems = useCallback((
    allowedOps: string[],
    maxAddSubOperand: number,
    maxAddSubResult: number,
    maxTimesTable: number
  ): MathBattleProblem[] => {
    if (!allProblems || allProblems.length === 0) return [];
    return allProblems.filter(p => {
      const question = p.question;
      const parts = question.split(/([\+\-\*\/])/).map(s => s.trim());
      if (parts.length < 3) return false; 
      
      const op = parts[1];
      const num1 = parseInt(parts[0], 10);
      const num2 = parseInt(parts[2], 10);

      if (isNaN(num1) || isNaN(num2) || !op) return false;
      if (!allowedOps.includes(op)) return false;

      if (op === '+' || op === '-') {
        return num1 <= maxAddSubOperand && num1 >= 0 &&
               num2 <= maxAddSubOperand && num2 >= 0 &&
               p.answer <= maxAddSubResult && p.answer >= 0;
      } else if (op === '*') {
        return num1 <= maxTimesTable && num1 >= 0 &&
               num2 <= maxTimesTable && num2 >= 0 &&
               p.answer <= (maxTimesTable * maxTimesTable) && p.answer >= 0;
      } else if (op === '/') {
        return num2 !== 0 && 
               num1 <= (maxTimesTable * maxTimesTable) && num1 >=0 && 
               num2 <= maxTimesTable && num2 >=0 && 
               Number.isInteger(p.answer) && 
               p.answer <= maxTimesTable && p.answer >= 0; 
      }
      return false;
    });
  }, [allProblems]);


  const generateProblemSet = useCallback(() => {
    let problemPool: MathBattleProblem[];
    const maxAddSubOperand = 100;
    const maxAddSubResult = 100;
    const maxTimesTable = 12;

    if (problemIndex < 5) { 
      problemPool = getValidProblems(['+', '-'], maxAddSubOperand, maxAddSubResult, maxTimesTable);
    } else { 
      problemPool = getValidProblems(['+', '-', '*', '/'], maxAddSubOperand, maxAddSubResult, maxTimesTable);
    }
    
    const shuffled = [...problemPool].sort(() => 0.5 - Math.random());
    if (shuffled.length > 0) {
        return shuffled[0];
    } else {
        console.warn(`No problems found for turn ${problemIndex + 1} with current filters. Using fallback.`);
        const fallbackOps = (problemIndex < 5) ? ['+', '-'] : ['+', '-', '*', '/'];
        let simplerPool = getValidProblems(fallbackOps, 20, 20, 10); 
        if (simplerPool.length === 0) { 
            simplerPool = allProblems.filter(p => fallbackOps.includes(p.question.split(/([\+\-\*\/])/)[1]));
        }
        const fallbackShuffled = [...simplerPool].sort(() => 0.5 - Math.random());
        return fallbackShuffled.length > 0 ? fallbackShuffled[0] : allProblems[0] || null; 
    }
  }, [problemIndex, allProblems, getValidProblems]);


  const loadProblem = useCallback(() => {
    if (problemIndex >= MAX_PROBLEMS_PER_GAME || allProblems.length === 0) {
      setGamePhase('over');
      return;
    }
    const newProblem = generateProblemSet();
    if (newProblem) {
        setCurrentProblem(newProblem);
    } else {
        console.error("Failed to generate a new problem. Ending game.");
        setGamePhase('over'); 
    }
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswerSubmitted(false);
  }, [problemIndex, generateProblemSet, allProblems.length]);
  
  useEffect(() => {
    if (gamePhase === 'playing' && allProblems.length > 0) {
      loadProblem();
    }
  }, [gamePhase, problemIndex, allProblems.length, loadProblem]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gamePhase === 'playing' && timeLeft > 0 && !isAnswerSubmitted) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gamePhase === 'playing' && timeLeft === 0 && !isAnswerSubmitted) {
      setFeedback({ message: `Time's up! The answer was ${currentProblem?.answer}.`, type: 'incorrect' });
      setIsAnswerSubmitted(true); 
      setTimeout(() => { 
        if (problemIndex < MAX_PROBLEMS_PER_GAME - 1) {
          setProblemIndex(prev => prev + 1);
        } else {
          setGamePhase('over');
        }
      }, 1200); 
    } else if (gamePhase === 'playing' && timeLeft === 0 && isAnswerSubmitted) {
        setGamePhase('over');
    }
    return () => clearTimeout(timerId);
  }, [gamePhase, timeLeft, isAnswerSubmitted, currentProblem, problemIndex]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setProblemIndex(0);
    setIsAnswerSubmitted(false);
    setSelectedOption(null); // Reset selected option
    setFeedback(null); // Clear feedback
    setGamePhase('playing');
  };

  const handleOptionSelect = (option: number) => {
    if (isAnswerSubmitted || gamePhase !== 'playing') return; // Ensure game is active
    setSelectedOption(option);
    handleSubmit(option);
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
    
    setTimeout(() => {
      if (timeLeft > 0) { 
        if (problemIndex < MAX_PROBLEMS_PER_GAME - 1) {
          setProblemIndex(prev => prev + 1);
          // loadProblem will be called by useEffect due to problemIndex change
        } else {
          setGamePhase('over');
        }
      } else {
        setGamePhase('over'); 
      }
    }, 1200);
  };
  
  const instructions = `
    Test your mental math skills against the clock!
    - Click "Start Game" to begin.
    - You have ${GAME_DURATION_SECONDS} seconds to answer as many questions as possible (up to ${MAX_PROBLEMS_PER_GAME}).
    - Solve the math problem shown and click one of the answer choices.
    - Correct answers increase your score.
    - Problems may involve addition, subtraction, multiplication, or division.
    - For addition/subtraction, operands and results are up to 100. Answers are non-negative.
    - For multiplication/division, problems use up to the 12 times tables. Division results in whole numbers.
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
                {currentProblem.question.replace(/\*/g, '×').replace(/\//g, '÷')} = ?
              </p>
            </Card>
            
            <AnswerOptionButtons
              options={currentProblem.options}
              onSelectOption={handleOptionSelect}
              disabled={isAnswerSubmitted}
              correctAnswer={isAnswerSubmitted ? currentProblem.answer : null}
              selectedAnswer={selectedOption}
            />

            {feedback && isAnswerSubmitted && (
              <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className={cn(
                feedback.type === 'correct' ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400' : 
                'bg-destructive/10 border-destructive/50 text-destructive'
              )}>
                {feedback.type === 'correct' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle className={cn(feedback.type === 'correct' ? "text-green-700 dark:text-green-400" : "text-destructive")}>{feedback.type === 'correct' ? 'Correct!' : 'Incorrect!'}</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {gamePhase === 'over' && (
          <div className="text-center space-y-4 p-6 bg-primary/10 rounded-lg">
            <h3 className="text-2xl font-bold text-primary">Game Over!</h3>
            <p className="text-xl text-foreground">Your final score: <span className="font-bold">{score}</span></p>
            <p className="text-muted-foreground">You attempted {problemIndex >= MAX_PROBLEMS_PER_GAME || timeLeft === 0 ? Math.min(problemIndex + (isAnswerSubmitted || timeLeft === 0 ? 1:0) , MAX_PROBLEMS_PER_GAME) : problemIndex +1 } questions.</p>
            <Button onClick={startGame} size="lg" variant="outline">
              <RotateCw className="mr-2 h-5 w-5" /> Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
