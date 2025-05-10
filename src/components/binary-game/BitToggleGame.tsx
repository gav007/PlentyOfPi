
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
    else maxTarget = 255;
    return Math.floor(Math.random() * (maxTarget + 1));
  };

  const startNewTurnLogic = useCallback((currentTurn: number, currentFixedBitCount: 8) => {
    if (currentTurn > MAX_TURNS) {
      setIsGameOver(true);
      setIsChallengeActive(false);
      if (timerId) clearInterval(timerId);
      setTimerId(null);
      setFeedbackMessage(`Game Over! Final Score: ${score} / ${MAX_TURNS * 100}`);
      return;
    }

    setBitCount(currentFixedBitCount); // Ensure game is 8-bit
    resetBits(currentFixedBitCount);
    
    const newTarget = getTargetForTurn(currentTurn);
    setTargetDecimal(newTarget);
    
    const timeForThisTurn = getTimeForTurn(currentTurn);
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
          setFeedbackMessage(`Time's up! Target was ${newTarget} (${BitUtils.decimalToBinary(newTarget, currentFixedBitCount)}). +0 points. Your score: ${score}`);
          setIsCorrect(false);
          setTurn(turn => turn + 1); // Auto-advance on timeout
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  }, [resetBits, timerId, score]); // Added score to deps for feedback message

  const handleGameModeToggle = (checked: boolean) => {
    setGameMode(checked);
    if (checked) {
      setTurn(1);
      setScore(0);
      setIsGameOver(false);
      setFeedbackMessage(null);
      setIsCorrect(null);
      // Game is always 8-bit
      setBitCount(8); 
      resetBits(8); 
      startNewTurnLogic(1, 8);
    } else {
      if (timerId) clearInterval(timerId);
      setTimerId(null);
      setTargetDecimal(null);
      setTimeLeft(INITIAL_CONVERTER_TIMER_SECONDS); // Reset to a default or keep as is
      setFeedbackMessage(null);
      setIsCorrect(null);
      setIsChallengeActive(false);
      setIsGameOver(false);
      setTurn(1); // Reset turn
      // Do not reset score here as it's total score, game is just off
      // bitCount remains what it was, or user can toggle it.
      // resetBits(bitCount); // Reset to current potentially non-8-bit value
    }
  };
  
  const handleToggleBit = (index: number) => {
    if (!gameMode || (gameMode && !isChallengeActive) || isGameOver) return;

    setFeedbackMessage(null); // Clear previous turn's specific feedback if any
    // setIsCorrect(null); // Don't clear isCorrect as it's tied to previous result
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
    // If gameMode was on and then turned off, and then bitCount changes, targetDecimal etc. should be null.
    // This is handled by handleGameModeToggle(false).
  };

  const handleCheckAnswer = () => {
    if (!isChallengeActive || isGameOver || targetDecimal === null) return;

    if (timerId) clearInterval(timerId);
    setIsChallengeActive(false);

    const accuracy = decimalValue === targetDecimal ? 1 : 0;
    // Ensure timeFactor is between 0 and 1, and handle currentChallengeMaxTime potentially being 0 (though unlikely with getTimeForTurn logic)
    const timeFactor = currentChallengeMaxTime > 0 ? Math.max(0, Math.min(1, timeLeft / currentChallengeMaxTime)) : 0;
    const turnScore = Math.floor(100 * accuracy * timeFactor);
    const newTotalScore = score + turnScore;
    setScore(newTotalScore);

    if (accuracy === 1) {
      setFeedbackMessage(`Correct! +${turnScore} points. Target: ${targetDecimal}. Your score: ${newTotalScore}`);
      setIsCorrect(true);
    } else {
      setFeedbackMessage(`Incorrect. Target: ${targetDecimal} (${BitUtils.decimalToBinary(targetDecimal, 8)}). You entered: ${decimalValue} (${BitUtils.decimalToBinary(decimalValue, 8)}). +0 points. Your score: ${newTotalScore}`);
      setIsCorrect(false);
    }
    setTurn(prev => prev + 1); // Auto-advance after checking
  };
  
  // Effect for auto-advancing turns after the first one
  useEffect(() => {
    if (gameMode && !isGameOver && turn > 1 && !isChallengeActive) {
        // This means turn has advanced from a previous completed turn (submit or timeout).
        // isChallengeActive is false, feedbackMessage is set.
        // Apply delay for feedback readability.
        const timeoutId = setTimeout(() => {
            if (gameMode && !isGameOver) { // Re-check state before executing
                startNewTurnLogic(turn, 8);
            }
        }, feedbackMessage ? 2000 : 50); // Delay more if there's feedback, less otherwise
        return () => clearTimeout(timeoutId);
    }
  }, [turn, gameMode, isGameOver, isChallengeActive, startNewTurnLogic, feedbackMessage]);


  const handleRestartGame = () => {
    handleGameModeToggle(false); // Turn off to clean up
    setTimeout(() => handleGameModeToggle(true), 50); // Turn back on to restart
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
              disabled={(gameMode && !isChallengeActive) || isGameOver} 
            />
          </div>
          
          <BitOutputPanel 
            decimal={decimalValue} 
            hex={hexValue} 
            binary={binaryString}
            gameMode={gameMode}
            targetDecimal={targetDecimal}
            score={score} // Total score
            timeLeft={timeLeft}
            turn={turn}
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
