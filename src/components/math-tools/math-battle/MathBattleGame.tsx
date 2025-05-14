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
import { cn } from '@/lib/utils';

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
     // Ensure problemsData.problems exists and is an array before filtering
     const problems = Array.isArray(problemsData?.problems) ? problemsData.problems : [];
     setAllProblems(problems.filter(p => p.type === 'arithmetic') as MathBattleProblem[]);
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
        // Ensure num1 is a multiple of num2 for whole number division results
        return num2 !== 0 && 
               num1 % num2 === 0 && // Ensure whole number result
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

    // Difficulty scaling:
    // Turns 1-3 (index 0-2): Addition/Subtraction, operands up to 20, result up to 20
    // Turns 4-7 (index 3-6): Addition/Subtraction up to 100. Basic Multiplication up to 10x10.
    // Turns 8-10 (index 7-9): All ops, full range up to 12x12 for mult/div.
    let currentDifficultyOps: string[];
    let currentMaxAddSubOperand = maxAddSubOperand;
    let currentMaxAddSubResult = maxAddSubResult;
    let currentMaxTimesTable = maxTimesTable;

    if (problemIndex < 3) { // Easy
        currentDifficultyOps = ['+', '-'];
        currentMaxAddSubOperand = 20;
        currentMaxAddSubResult = 20;
        currentMaxTimesTable = 0; // No multiplication/division
    } else if (problemIndex < 7) { // Medium
        currentDifficultyOps = ['+', '-', '*'];
        currentMaxAddSubOperand = 50; // Increase difficulty slightly
        currentMaxAddSubResult = 50;
        currentMaxTimesTable = 10;
    } else { // Hard
        currentDifficultyOps = ['+', '-', '*', '/'];
        // Use full defaults for hard
    }
    
    problemPool = getValidProblems(currentDifficultyOps, currentMaxAddSubOperand, currentMaxAddSubResult, currentMaxTimesTable);
    
    const shuffled = [...problemPool].sort(() => 0.5 - Math.random());
    if (shuffled.length > 0) {
        return shuffled[0];
    } else {
        // Fallback if no specific problems match, widen criteria
        console.warn(`No problems found for turn ${problemIndex + 1} with difficulty filters. Using broader fallback.`);
        let fallbackPool = getValidProblems(currentDifficultyOps, 100, 100, 12); // Use broadest for the ops
        if (fallbackPool.length === 0) { // If still no problems, use any arithmetic problem
            fallbackPool = allProblems.filter(p => p.type === 'arithmetic' && ['+', '-', '*', '/'].includes(p.question.split(/([\+\-\*\/])/)[1]));
        }
        const fallbackShuffled = [...fallbackPool].sort(() => 0.5 - Math.random());
        return fallbackShuffled.length > 0 ? fallbackShuffled[0] : (allProblems[0] || null); 
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
    setSelectedOption(null); 
    setFeedback(null); 
    setGamePhase('playing');
  };

  const handleOptionSelect = (option: number) => {
    if (isAnswerSubmitted || gamePhase !== 'playing') return; 
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
    - Problems involve addition & subtraction (operands/results up to 100, positive answers), and multiplication & division (up to 12 times tables, whole number division results).
    - Difficulty increases over turns.
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
                "text-sm", // Ensure text size is consistent
                feedback.type === 'correct' ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400' : 
                'bg-destructive/10 border-destructive/50 text-destructive'
              )}>
                <div className="flex items-center gap-1.5">
                  {feedback.type === 'correct' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle className={cn("font-semibold", feedback.type === 'correct' ? "text-green-700 dark:text-green-400" : "text-destructive")}>{feedback.type === 'correct' ? 'Correct!' : 'Incorrect!'}</AlertTitle>
                </div>
                <AlertDescription className="mt-1 pl-6">{feedback.message}</AlertDescription>
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
