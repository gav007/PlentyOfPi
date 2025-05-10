
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import HexPrompt from './HexPrompt';
import HexDigitGrid from './HexDigitGrid';
import HexSelection from './HexSelection';
import ScorePanelHex from './ScorePanelHex';
import GameControlsHex from './GameControlsHex';
import ExplanationPanel from './ExplanationPanel'; // New component
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

  const [showExplanation, setShowExplanation] = useState<boolean>(false); // Mode toggle state

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
    // Reset score and streak only if it's a true game round, not just mode switch
    if (!showExplanation) {
      setScore(0); // Reset score for a new challenge session
      setStreak(0);
    }
  }, [showExplanation]); // Add showExplanation to dependencies if score/streak reset depends on it

  const resetSelectionsAndFeedback = () => {
    setSelectedHighNibble(null);
    setSelectedLowNibble(null);
    setIsSubmitted(false);
    setFeedbackMessage(null);
    setIsCorrect(null);
  };

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
    // In challenge mode, prevent selection if submitted. In learn mode, always allow.
    if (!showExplanation && isSubmitted) return;

    if (selectedHighNibble === null) {
      setSelectedHighNibble(digit);
    } else if (selectedLowNibble === null) {
      setSelectedLowNibble(digit);
    } else { // If both are selected, allow changing selection by resetting lowNibble
        setSelectedHighNibble(digit);
        setSelectedLowNibble(null);
    }
  };

  const handleSubmit = () => {
    if (selectedHighNibble === null || selectedLowNibble === null || isSubmitted || showExplanation) return;

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

  const handleModeToggle = (checked: boolean) => {
    setShowExplanation(checked);
    resetSelectionsAndFeedback();
    if (!checked) { // Switching TO Challenge Mode
      // Start a completely new round for the challenge
      const newTarget = generateRandomDecimalTarget();
      setTargetDecimal(newTarget);
      setCorrectAnswerHex(decimalToFullHexString(newTarget));
      setScore(0); // Reset score for a new challenge session
      setStreak(0);
    }
    // If switching TO Learn Mode, the current targetDecimal (or a new one if previous was challenge) is used.
    // If coming from a challenge, it might be good to get a new number for learning too, or keep it.
    // Current logic: keeps targetDecimal unless !checked, then new one.
    // Let's ensure a fresh target for learn mode as well if it was just a game round.
    // No, the prompt implies learn mode uses the *current* number if switching from challenge.
    // And if starting in learn mode, startNewRound handles initial target.
  };


  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 flex flex-col items-center max-w-screen-md">
      <Card className="w-full shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Puzzle className="w-8 h-8" />
            Hex Boxes Challenge
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {showExplanation 
              ? "Learn how to convert decimal to hexadecimal."
              : "Convert the decimal number to its two-digit hexadecimal equivalent."}
          </CardDescription>
          <div className="flex justify-end items-center pt-4">
            <Label htmlFor="mode-toggle" className="mr-2 text-sm">🧪 Learn Mode</Label>
            <Switch id="mode-toggle" checked={showExplanation} onCheckedChange={handleModeToggle} />
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4">
          <HexPrompt targetDecimal={targetDecimal} />

          {showExplanation ? (
            <ExplanationPanel targetDecimal={targetDecimal} />
          ) : (
            <ScorePanelHex score={score} streak={streak} />
          )}

          <HexSelection 
            highNibble={selectedHighNibble} 
            lowNibble={selectedLowNibble}
            currentDecimalValue={currentSelectionDecimal}
          />
          <HexDigitGrid
            onDigitSelect={handleDigitSelect}
            selectedHighNibble={selectedHighNibble}
            selectedLowNibble={selectedLowNibble}
            // In challenge mode, disable if submitted OR both nibbles selected.
            // In learn mode, grid is always active to allow exploration.
            disabled={!showExplanation && (isSubmitted || (selectedHighNibble !== null && selectedLowNibble !== null))}
          />

          {!showExplanation && (
            <GameControlsHex
              onSubmit={handleSubmit}
              onNextRound={() => { // When clicking "Next Round" or "Skip"
                const newTarget = generateRandomDecimalTarget();
                setTargetDecimal(newTarget);
                resetSelectionsAndFeedback();
                setCorrectAnswerHex(decimalToFullHexString(newTarget));
              }}
              isSubmitted={isSubmitted}
              isCorrect={isCorrect}
              feedbackMessage={feedbackMessage}
              correctAnswerHex={correctAnswerHex}
              canSubmit={canSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

