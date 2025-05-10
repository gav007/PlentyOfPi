'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HexPrompt from './HexPrompt';
import HexDigitGrid from './HexDigitGrid';
import HexSelection from './HexSelection';
import ScorePanelHex from './ScorePanelHex';
import GameControlsHex from './GameControlsHex';
import {
  generateRandomDecimalTarget,
  decimalToFullHexString,
  hexNibblesToDecimal,
} from '@/lib/hexUtils';
import { Puzzle } from 'lucide-react';

const MAX_SCORE_PER_ROUND = 100;

export default function HexBoxesGame() {
  const [targetDecimal, setTargetDecimal] = useState<number>(0);
  const [selectedHighNibble, setSelectedHighNibble] = useState<string | null>(null);
  const [selectedLowNibble, setSelectedLowNibble] = useState<string | null>(null);
  const [currentSelectionHex, setCurrentSelectionHex] = useState<string>("__");
  const [currentSelectionDecimal, setCurrentSelectionDecimal] = useState<number | null>(null);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [correctAnswerHex, setCorrectAnswerHex] = useState<string>("");

  const startNewRound = useCallback(() => {
    const newTarget = generateRandomDecimalTarget();
    setTargetDecimal(newTarget);
    setSelectedHighNibble(null);
    setSelectedLowNibble(null);
    setCurrentSelectionHex("__");
    setCurrentSelectionDecimal(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setFeedbackMessage(null);
    setCorrectAnswerHex(decimalToFullHexString(newTarget));
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  useEffect(() => {
    const high = selectedHighNibble ?? '_';
    const low = selectedLowNibble ?? '_';
    setCurrentSelectionHex(`${high}${low}`);
    setCurrentSelectionDecimal(hexNibblesToDecimal(selectedHighNibble, selectedLowNibble));
  }, [selectedHighNibble, selectedLowNibble]);

  const handleDigitSelect = (digit: string) => {
    if (isSubmitted) return;

    if (selectedHighNibble === null) {
      setSelectedHighNibble(digit);
    } else if (selectedLowNibble === null) {
      setSelectedLowNibble(digit);
    }
    // If both are selected, grid is effectively disabled for further selections
    // until reset or submission. Or, allow re-selection:
    // else { // Allow changing selection
    //   setSelectedHighNibble(digit);
    //   setSelectedLowNibble(null);
    // }
  };

  const handleSubmit = () => {
    if (selectedHighNibble === null || selectedLowNibble === null || isSubmitted) return;

    const playerHex = `${selectedHighNibble}${selectedLowNibble}`;
    const correctHexValue = decimalToFullHexString(targetDecimal);
    setCorrectAnswerHex(correctHexValue);

    if (playerHex === correctHexValue) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + MAX_SCORE_PER_ROUND + (streak * 10)); // Streak bonus
      setStreak((prevStreak) => prevStreak + 1);
      setFeedbackMessage(`Correct! ${targetDecimal} is indeed ${playerHex}.`);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setFeedbackMessage(`Not quite! The correct hex for ${targetDecimal} was ${correctHexValue}. You selected ${playerHex}.`);
    }
    setIsSubmitted(true);
  };
  
  const canSubmit = selectedHighNibble !== null && selectedLowNibble !== null;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 flex flex-col items-center max-w-screen-md">
      <Card className="w-full shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Puzzle className="w-8 h-8" />
            Hex Boxes Challenge
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Convert the decimal number to its two-digit hexadecimal equivalent.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4">
          <HexPrompt targetDecimal={targetDecimal} />
          <ScorePanelHex score={score} streak={streak} />
          <HexSelection 
            highNibble={selectedHighNibble} 
            lowNibble={selectedLowNibble}
            currentDecimalValue={currentSelectionDecimal}
          />
          <HexDigitGrid
            onDigitSelect={handleDigitSelect}
            selectedHighNibble={selectedHighNibble}
            selectedLowNibble={selectedLowNibble}
            disabled={isSubmitted || (selectedHighNibble !== null && selectedLowNibble !== null)}
          />
          <GameControlsHex
            onSubmit={handleSubmit}
            onNextRound={startNewRound}
            isSubmitted={isSubmitted}
            isCorrect={isCorrect}
            feedbackMessage={feedbackMessage}
            correctAnswerHex={correctAnswerHex}
            canSubmit={canSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
