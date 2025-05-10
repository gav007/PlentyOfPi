
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, HelpCircle, Orbit, Sigma, Waves, Gamepad2 } from 'lucide-react';
import UnitCircleCanvas from './UnitCircleCanvas';
import AngleDisplay from './AngleDisplay';
import TrigInfoPanel from './TrigInfoPanel';
import SineWavePlot from './SineWavePlot';
import UnitCircleGamePanel from './UnitCircleGamePanel';
import { checkAngleMatch, commonAnglesDegrees, formatAngleToPiString } from '@/lib/AngleEvaluation'; 

const SVG_SIZE = 320;
const SINE_WAVE_HEIGHT = 150;

// Convert commonAnglesDegrees to radians for internal use if needed, or keep target in degrees
const commonAnglesRad = commonAnglesDegrees.map(deg => (deg * Math.PI) / 180);

export default function UnitCircleExplorer() {
  const [angleRad, setAngleRad] = useState<number>(Math.PI / 4); // Current user-dragged angle in radians
  const [showCheatOverlay, setShowCheatOverlay] = useState<boolean>(false);

  // Game Mode State
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [targetAngleRad, setTargetAngleRad] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState<boolean | null>(null);
  const [isGameInteractionLocked, setIsGameInteractionLocked] = useState<boolean>(false);


  const startNewGameTurn = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * commonAnglesRad.length);
    setTargetAngleRad(commonAnglesRad[randomIndex]);
    setGameFeedback(null);
    setIsGuessCorrect(null);
    setIsGameInteractionLocked(false);
  }, []);

  useEffect(() => {
    if (gameMode) {
      startNewGameTurn();
      setScore(0);
      setStreak(0);
    } else {
      setTargetAngleRad(null);
      setGameFeedback(null);
      setIsGuessCorrect(null);
      setIsGameInteractionLocked(false);
    }
  }, [gameMode, startNewGameTurn]);

  const handleAngleChange = (newAngle: number) => {
    if (!isGameInteractionLocked) {
      setAngleRad(newAngle);
    }
  };
  
  const handleLockIn = () => {
    if (targetAngleRad === null || angleRad === null || isGameInteractionLocked) return;

    setIsGameInteractionLocked(true); // Lock interaction while processing
    const { match, errorDegrees } = checkAngleMatch(angleRad, targetAngleRad, true);

    if (match) {
      const turnScore = Math.max(0, 100 - Math.floor(errorDegrees));
      setScore(prev => prev + turnScore);
      setStreak(prev => prev + 1);
      setGameFeedback(`Correct! Target was ${formatAngleToPiString(targetAngleRad)}. Error: ${errorDegrees.toFixed(1)}°. Score: +${turnScore}`);
      setIsGuessCorrect(true);
    } else {
      setStreak(0);
      setGameFeedback(`Incorrect. Target was ${formatAngleToPiString(targetAngleRad)}. Your error: ${errorDegrees.toFixed(1)}°.`);
      setIsGuessCorrect(false);
    }

    setTimeout(() => {
      startNewGameTurn();
    }, 2500); // Delay for feedback readability
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Orbit className="w-8 h-8" />
          Unit Circle Explorer
        </h1>
        <p className="text-muted-foreground mt-1">
          Drag the point on the circle or play the game to test your knowledge!
        </p>
      </header>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 my-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="game-mode-toggle" className="text-sm sm:text-base flex items-center gap-1">
            <Gamepad2 className="w-5 h-5" /> Game Mode
          </Label>
          <Switch
            id="game-mode-toggle"
            checked={gameMode}
            onCheckedChange={setGameMode}
            aria-label="Toggle game mode"
          />
        </div>
        <div className="flex items-center space-x-2">
            <Label htmlFor="cheat-overlay-toggle" className="text-sm sm:text-base flex items-center gap-1">
                <Eye className="w-4 h-4" /> Show Helper Lines
            </Label>
            <Switch
            id="cheat-overlay-toggle"
            checked={showCheatOverlay}
            onCheckedChange={setShowCheatOverlay}
            aria-label="Toggle cheat sheet overlay"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Orbit className="w-6 h-6 text-primary" />
              Interactive Unit Circle
            </CardTitle>
            <CardDescription>
              {gameMode ? "Set the angle to match the target!" : "Drag the handle on the circle."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <UnitCircleCanvas
              angle={angleRad}
              onAngleChange={handleAngleChange}
              showCheatOverlay={showCheatOverlay}
              size={SVG_SIZE}
              gameMode={gameMode}
              targetAngleRad={targetAngleRad}
              isGameInteractionLocked={isGameInteractionLocked}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sigma className="w-6 h-6 text-primary" />
                Angle & Trig Values
              </CardTitle>
              <CardDescription>
                Displays information for the current pointer position.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AngleDisplay angleRadians={angleRad} />
              <TrigInfoPanel angleRadians={angleRad} />
            </CardContent>
          </Card>

          {gameMode && targetAngleRad !== null && (
            <UnitCircleGamePanel
              targetAngleRad={targetAngleRad}
              onLockIn={handleLockIn}
              score={score}
              streak={streak}
              feedbackMessage={gameFeedback}
              isCorrect={isGuessCorrect}
              isGameInteractionLocked={isGameInteractionLocked}
            />
          )}
        </div>
      </div>

      {!gameMode && (
        <Card className="shadow-lg mt-6 md:mt-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-primary" />
              Sine Wave Visualization
            </CardTitle>
            <CardDescription>
              This graph shows sin(θ) as the angle θ changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SineWavePlot
              angle={angleRad}
              height={SINE_WAVE_HEIGHT}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
