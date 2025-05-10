
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

const INITIAL_TIMER_SECONDS = 60;

export default function BitToggleGame() {
  const [bitCount, setBitCount] = useState<8 | 16>(8);
  const [bits, setBits] = useState<number[]>(Array(8).fill(0));
  
  const [binaryString, setBinaryString] = useState("".padStart(8, "0"));
  const [decimalValue, setDecimalValue] = useState(0);
  const [hexValue, setHexValue] = useState("0x00");

  const [gameMode, setGameMode] = useState(false);
  const [targetDecimal, setTargetDecimal] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIMER_SECONDS);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

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

  const handleToggleBit = (index: number) => {
    if (!isChallengeActive && gameMode) return;

    setFeedbackMessage(null);
    setIsCorrect(null);
    const updatedBits = [...bits];
    updatedBits[index] = updatedBits[index] === 0 ? 1 : 0;
    setBits(updatedBits);
  };

  const handleBitCountChange = (newBitCount: 8 | 16) => {
    setBitCount(newBitCount);
    resetBits(newBitCount);
    if (gameMode) {
      startNewChallenge(newBitCount);
    }
  };

  const startNewChallenge = useCallback((currentBitCount: 8 | 16) => {
    resetBits(currentBitCount);
    const newTarget = BitUtils.generateRandomDecimal(currentBitCount);
    setTargetDecimal(newTarget);
    setTimeLeft(INITIAL_TIMER_SECONDS);
    setFeedbackMessage(null);
    setIsCorrect(null);
    setIsChallengeActive(true);

    if (timerId) clearInterval(timerId);
    const newTimerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(newTimerId);
          setIsChallengeActive(false);
          setFeedbackMessage("Time's up! Try the next challenge.");
          setIsCorrect(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  }, [resetBits, timerId]);
  

  const handleGameModeToggle = (checked: boolean) => {
    setGameMode(checked);
    if (checked) {
      setScore(0);
      startNewChallenge(bitCount);
    } else {
      if (timerId) clearInterval(timerId);
      setTimerId(null);
      setTargetDecimal(null);
      setTimeLeft(INITIAL_TIMER_SECONDS);
      setFeedbackMessage(null);
      setIsCorrect(null);
      setIsChallengeActive(false);
      resetBits(bitCount);
    }
  };

  const handleCheckAnswer = () => {
    if (targetDecimal === null) return;
    if (timerId) clearInterval(timerId); 

    if (decimalValue === targetDecimal) {
      const newScore = score + 10 + timeLeft;
      setScore(newScore);
      setFeedbackMessage(`Awesome! ${decimalValue} is correct. Your score: ${newScore}`);
      setIsCorrect(true);
    } else {
      setFeedbackMessage(`Not quite. You entered ${decimalValue} (${BitUtils.decimalToBinary(decimalValue, bitCount)}). The correct binary for ${targetDecimal} is ${BitUtils.decimalToBinary(targetDecimal, bitCount)}.`);
      setIsCorrect(false);
    }
    setIsChallengeActive(false);
  };

  const handleNextChallenge = () => {
    startNewChallenge(bitCount);
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
            Light the Bits. Learn the System.
          </CardDescription>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="bit-count-toggle" className="text-sm sm:text-base">8-Bit</Label>
              <Switch
                id="bit-count-toggle"
                checked={bitCount === 16}
                onCheckedChange={(checked) => handleBitCountChange(checked ? 16 : 8)}
                aria-label="Toggle bit count between 8 and 16"
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
            <BitSwitchRow bits={bits} onToggleBit={handleToggleBit} bitCount={bitCount} disabled={gameMode && !isChallengeActive} />
          </div>
          
          <BitOutputPanel 
            decimal={decimalValue} 
            hex={hexValue} 
            binary={binaryString}
            gameMode={gameMode}
            targetDecimal={targetDecimal}
            score={score}
            timeLeft={timeLeft}
          />

          {gameMode && (
            <GameControls
              feedbackMessage={feedbackMessage}
              isCorrect={isCorrect}
              onCheckAnswer={handleCheckAnswer}
              onNextChallenge={handleNextChallenge}
              isChallengeActive={isChallengeActive}
              timeLeft={timeLeft}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

