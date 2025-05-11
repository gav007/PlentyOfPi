
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FractionExpression from './FractionExpression';
import AnswerOptions from './AnswerOptions';
import GameFeedback from './GameFeedback';
import GameSummary from './GameSummary';
import { generateQuestion } from '@/lib/fractionGameUtils';
import type { GameState, FractionValue, FractionExpressionDef } from '@/types/fractionDuel';
import { TestTubeDiagonal } from 'lucide-react'; // Or other suitable icon

const MAX_TURNS = 10;

const initialGameState: GameState = {
  turn: 1,
  expression: null,
  correctAnswer: null,
  choices: [],
  selectedAnswer: null,
  isCorrect: null,
  score: 0,
  streak: 0,
  highestStreak: 0,
  phase: 'question',
  startTimePerTurn: null,
};

export default function FractionDuelCard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const loadTurnData = useCallback((currentTurn: number) => {
    const { expression, correctAnswer, choices } = generateQuestion(currentTurn);
    setGameState(prev => ({
      ...prev,
      turn: currentTurn,
      expression,
      correctAnswer,
      choices,
      selectedAnswer: null,
      isCorrect: null,
      phase: 'question',
      startTimePerTurn: Date.now(),
    }));
  }, []);

  useEffect(() => {
    loadTurnData(gameState.turn);
  }, [gameState.turn, loadTurnData]); // Only re-load if turn changes AND loadTurnData is stable


  const handleAnswerSelect = (answer: FractionValue) => {
    if (gameState.phase !== 'question' || !gameState.correctAnswer) return;

    const isCorrect = answer.num === gameState.correctAnswer.num && answer.den === gameState.correctAnswer.den;
    let newScore = gameState.score;
    let newStreak = gameState.streak;
    let newHighestStreak = gameState.highestStreak;

    if (isCorrect) {
      newScore += 1; // Simple +1 for correct
      // Optional: Time bonus can be added here
      // const timeTaken = (Date.now() - (gameState.startTimePerTurn ?? Date.now())) / 1000;
      // const timeBonus = Math.max(0, 10 - Math.floor(timeTaken / 2)); // Example time bonus
      // newScore += timeBonus;
      newStreak += 1;
      if (newStreak > newHighestStreak) {
        newHighestStreak = newStreak;
      }
    } else {
      newStreak = 0;
    }

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      isCorrect,
      score: newScore,
      streak: newStreak,
      highestStreak: newHighestStreak,
      phase: 'feedback',
    }));
  };

  const handleNextTurn = () => {
    if (gameState.turn < MAX_TURNS) {
      setGameState(prev => ({ ...prev, turn: prev.turn + 1 }));
      // loadTurnData will be called by useEffect due to turn change
    } else {
      setGameState(prev => ({ ...prev, phase: 'summary' }));
    }
  };

  const handleRestartGame = () => {
    setGameState(initialGameState);
    // loadTurnData will be called by useEffect after state reset to turn 1
  };
  
  if (!gameState.expression) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <TestTubeDiagonal className="w-8 h-8" /> Fraction Duel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading question...</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
           <TestTubeDiagonal className="w-8 h-8" /> Fraction Duel
        </CardTitle>
        {gameState.phase !== 'summary' && (
          <CardDescription className="text-muted-foreground">
            Turn {gameState.turn}/{MAX_TURNS} | Score: {gameState.score} | Streak: {gameState.streak} 🔥
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState.phase === 'question' && gameState.expression && (
          <>
            <FractionExpression expression={gameState.expression} />
            <AnswerOptions
              choices={gameState.choices}
              onSelect={handleAnswerSelect}
              disabled={false}
            />
          </>
        )}
        {gameState.phase === 'feedback' && gameState.correctAnswer && gameState.expression && (
          <GameFeedback
            isCorrect={gameState.isCorrect}
            correctAnswer={gameState.correctAnswer}
            playerExpression={gameState.expression}
            selectedAnswer={gameState.selectedAnswer}
            onNext={handleNextTurn}
          />
        )}
        {gameState.phase === 'summary' && (
          <GameSummary
            score={gameState.score}
            totalTurns={MAX_TURNS}
            highestStreak={gameState.highestStreak}
            onRestart={handleRestartGame}
          />
        )}
      </CardContent>
    </Card>
  );
}
