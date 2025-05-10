
'use client';

import { useState, useEffect, useCallback } from 'react';
import BitDisplayRow from './BitDisplayRow';
import BitSwitchRow from './BitSwitchRow';
import BitOutputPanel from './BitOutputPanel';
import GameControls from './GameControls';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as BitUtils from '@/lib/BitUtils';
import { useToast } from "@/hooks/use-toast";

const MAX_TURNS = 10;
const INITIAL_CONVERTER_TIMER_SECONDS = 60; // For non-game mode, if ever used.

export default function BitToggleGame() {
  const [bitCount, setBitCount] = useState<8 | 16>(8);
  const [bits, setBits] = useState<number[]>(Array(8).fill(0));
  
  const [binaryString, setBinaryString] = useState("".padStart(8, "0"));
  const [decimalValue, setDecimalValue] = useState(0);
  const [hexValue, setHexValue] = useState("0x00");

  // Game State
  const [gameMode, setGameMode] = useState(false);
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(0); // Total score
  const [targetDecimal, setTargetDecimal] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_CONVERTER_TIMER_SECONDS);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentChallengeMaxTime, setCurrentChallengeMaxTime] = useState(INITIAL_CONVERTER_TIMER_SECONDS);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

  // Enhanced Scoring State
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [totalStars, setTotalStars] = useState(0);


  const { toast } = useToast();

  const resetBits = useCallback((count: 8 | 16) => {
    setBits(Array(count).fill(0));
  }, []);

  useEffect(() => {
    const currentBinaryString = bits.join('');
    setBinaryString(currentBinaryString);
    const currentDecimalValue = BitUtils.binaryToDecimal(currentBinaryString);
    setDecimalValue(currentDecimalValue);
    setHexValue(BitUtils.decimalToHex(currentDecimalValue, bitCount));
  }, [bits, bitCount]);

  const getTimeForTurn = (currentTurn: number): number => {
    return Math.max(60 - (currentTurn - 1) * 5, 15);
  };

  const getTargetForTurn = (currentTurn: number): number => {
    let maxTarget: number;
    if (currentTurn <= 3) maxTarget = 50;
    else if (currentTurn <= 6) maxTarget = 150;
    else maxTarget = 255; // Max for 8-bit
    return Math.floor(Math.random() * (maxTarget + 1));
  };

  const startNewTurnLogic = useCallback((currentTurnNum: number, currentFixedBitCount: 8) => {
    if (currentTurnNum > MAX_TURNS) { // Changed from >= to > to allow 10th turn to complete
      setIsGameOver(true);
      setIsChallengeActive(false);
      if (timerId) clearInterval(timerId);
      setTimerId(null);
      const avgStars = MAX_TURNS > 0 ? (totalStars / MAX_TURNS).toFixed(1) : "0.0";
      setFeedbackMessage(
        `Final Score: ${score}. Highest Streak: ${highestStreak}. Avg Stars: ${avgStars} ⭐. Well done!`
      );
      return;
    }

    setBitCount(currentFixedBitCount); // Ensure game is 8-bit
    resetBits(currentFixedBitCount);
    
    const newTarget = getTargetForTurn(currentTurnNum);
    setTargetDecimal(newTarget);
    
    const timeForThisTurn = getTimeForTurn(currentTurnNum);
    setTimeLeft(timeForThisTurn);
    setCurrentChallengeMaxTime(timeForThisTurn);
    
    setFeedbackMessage(null);
    setIsCorrect(null);
    setIsChallengeActive(true);

    if (timerId) clearInterval(timerId);
    const newTimerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(newTimerId);
          setIsChallengeActive(false);
          setCurrentStreak(0); // Streak reset on timeout
          setFeedbackMessage(`Time's up! Target was ${newTarget} (${BitUtils.decimalToBinary(newTarget, currentFixedBitCount)}). +0 points. Streak reset. Your score: ${score}`);
          setIsCorrect(false);
          setTurn(turn => turn + 1); // Auto-advance on timeout
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  }, [resetBits, timerId, score, totalStars, highestStreak]);

  const handleGameModeToggle = (checked: boolean) => {
    setGameMode(checked);
    if (checked) {
      setTurn(1);
      setScore(0);
      setIsGameOver(false);
      setFeedbackMessage(null);
      setIsCorrect(null);
      setCurrentStreak(0);
      setHighestStreak(0);
      setTotalStars(0);
      setBitCount(8); 
      resetBits(8); 
      startNewTurnLogic(1, 8);
    } else {
      if (timerId) clearInterval(timerId);
      setTimerId(null);
      setTargetDecimal(null);
      setTimeLeft(INITIAL_CONVERTER_TIMER_SECONDS);
      setFeedbackMessage(null);
      setIsCorrect(null);
      setIsChallengeActive(false);
      setIsGameOver(false); // Explicitly set game over to false
      setTurn(1); 
    }
  };
  
  const handleToggleBit = (index: number) => {
    // Allow toggling if not in game mode, OR if in game mode and challenge is active and game is not over.
    const canToggle = !gameMode || (gameMode && isChallengeActive && !isGameOver);
    if (!canToggle) return;

    setFeedbackMessage(null); 
    const updatedBits = [...bits];
    updatedBits[index] = updatedBits[index] === 0 ? 1 : 0;
    setBits(updatedBits);
  };

  const handleBitCountChange = (newBitCount: 8 | 16) => {
    if (gameMode) {
      toast({ title: "Game Mode Active", description: "Bit count is locked to 8-bit during the game." });
      return;
    }
    setBitCount(newBitCount);
    resetBits(newBitCount);
  };

  const handleCheckAnswer = () => {
    if (!isChallengeActive || isGameOver || targetDecimal === null) return;

    if (timerId) clearInterval(timerId);
    setIsChallengeActive(false);

    const accuracy = decimalValue === targetDecimal ? 1 : 0;
    const timeFactor = currentChallengeMaxTime > 0 ? Math.pow(Math.max(0, timeLeft) / currentChallengeMaxTime, 1.25) : 0;
    
    const difficultyBonus =
      targetDecimal >= 200 ? 1.2 :
      targetDecimal >= 100 ? 1.1 : 1.0;
    
    const streakBonus = currentStreak >= 3 ? 1.15 : 1.0;

    const turnScore = Math.floor(100 * accuracy * timeFactor * difficultyBonus * streakBonus);
    const newTotalScore = score + turnScore;
    setScore(newTotalScore);

    const stars =
      turnScore >= 90 ? 3 :
      turnScore >= 60 ? 2 :
      turnScore >= 30 ? 1 : 0;
    
    setTotalStars(prev => prev + stars);

    if (accuracy === 1) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setHighestStreak(prev => Math.max(prev, newStreak));
      setIsCorrect(true);
      const starDisplay = stars > 0 ? `${'⭐'.repeat(stars)}` : `(${stars} stars)`;
      setFeedbackMessage(
        `Correct! +${turnScore} points. ${starDisplay}. Streak: ${newStreak}. Your score: ${newTotalScore}`
      );
    } else {
      setCurrentStreak(0);
      setIsCorrect(false);
      setFeedbackMessage(
        `Incorrect. Target: ${targetDecimal} (${BitUtils.decimalToBinary(targetDecimal, bitCount)}). You entered: ${decimalValue} (${BitUtils.decimalToBinary(decimalValue, bitCount)}). +0 points. Streak reset. Your score: ${newTotalScore}`
      );
    }
    setTurn(prev => prev + 1);
  };
  
  useEffect(() => {
    if (gameMode && !isGameOver && turn > MAX_TURNS) { // Check if turn has exceeded max turns
        setIsGameOver(true);
        setIsChallengeActive(false);
        if (timerId) clearInterval(timerId);
        setTimerId(null);
        const avgStars = MAX_TURNS > 0 ? (totalStars / MAX_TURNS).toFixed(1) : "0.0";
        setFeedbackMessage(
          `Final Score: ${score}. Highest Streak: ${highestStreak}. Avg Stars: ${avgStars} ⭐. Well done!`
        );
        return; // Exit early if game over condition met here
    }
    
    // This handles advancing to the next turn OR starting a new turn after feedback is displayed
    if (gameMode && !isGameOver && !isChallengeActive) {
        const timeoutId = setTimeout(() => {
            if (gameMode && !isGameOver) { // Double check game state before starting new turn
                startNewTurnLogic(turn, 8);
            }
        }, feedbackMessage ? 2500 : 50); // Longer delay for feedback readability
        return () => clearTimeout(timeoutId);
    }
  }, [turn, gameMode, isGameOver, isChallengeActive, startNewTurnLogic, feedbackMessage, score, totalStars, highestStreak, timerId]);


  const handleRestartGame = () => {
    handleGameModeToggle(false); // Turn game mode off to reset
    setTimeout(() => handleGameModeToggle(true), 50); // Then turn it back on to start fresh
  };
  
  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 flex flex-col items-center max-w-screen-md">
      <Card className="w-full shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary">
            Binary Converter
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {gameMode ? "Match the target! 8-Bit Binary Challenge." : "Light the Bits. Learn the System."}
          </CardDescription>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="bit-count-toggle" className="text-sm sm:text-base">8-Bit</Label>
              <Switch
                id="bit-count-toggle"
                checked={bitCount === 16}
                onCheckedChange={(checked) => handleBitCountChange(checked ? 16 : 8)}
                aria-label="Toggle bit count between 8 and 16"
                disabled={gameMode}
              />
              <Label htmlFor="bit-count-toggle" className="text-sm sm:text-base">16-Bit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="game-mode-toggle" className="text-sm sm:text-base">Game Mode</Label>
              <Switch
                id="game-mode-toggle"
                checked={gameMode}
                onCheckedChange={handleGameModeToggle}
                aria-label="Toggle game mode"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4">
          <div className="flex flex-col items-center space-y-3 mb-6">
            <BitDisplayRow bits={bits} bitCount={bitCount} />
            <BitSwitchRow 
              bits={bits} 
              onToggleBit={handleToggleBit} 
              bitCount={bitCount} 
              disabled={(gameMode && !isChallengeActive) || (gameMode && isGameOver)} 
            />
          </div>
          
          <BitOutputPanel 
            decimal={decimalValue} 
            hex={hexValue} 
            binary={binaryString}
            gameMode={gameMode}
            targetDecimal={targetDecimal}
            score={score} 
            timeLeft={timeLeft}
            turn={gameMode && !isGameOver ? turn : null} // Only show turn if game is active and not over
            maxTurns={MAX_TURNS}
            isGameOver={isGameOver}
          />

          {gameMode && (
            <GameControls
              feedbackMessage={feedbackMessage}
              isCorrect={isCorrect}
              onCheckAnswer={handleCheckAnswer}
              isChallengeActive={isChallengeActive}
              timeLeft={timeLeft}
              isGameOver={isGameOver}
              onRestartGame={handleRestartGame}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

