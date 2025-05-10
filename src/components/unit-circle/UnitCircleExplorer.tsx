'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, Orbit, Sigma, Waves, Gamepad2 } from 'lucide-react';
import UnitCircleCanvas from './UnitCircleCanvas';
import AngleDisplay from './AngleDisplay';
import TrigInfoPanel from './TrigInfoPanel';
import SineWavePlot from './SineWavePlot';
import UnitCircleGamePanel from './UnitCircleGamePanel';
import { checkAngleMatch, formatAngleToPiString, getRandomAngleByDifficulty } from '@/lib/AngleEvaluation'; 

const SVG_SIZE = 320;
const SINE_WAVE_HEIGHT = 150;
const MAX_TURNS_UNIT_CIRCLE = 10;


const getPerformanceFeedback = (correct: number, total: number): string => {
    if (total === 0) return "Play the game to see your performance!";
    const percentage = correct / total;
    if (percentage <= 0.3) return "💡 Keep practicing! You'll get the hang of it.";
    if (percentage <= 0.7) return "👍 Good job! Getting there.";
    if (percentage < 1) return "🌟 Great work! Almost perfect.";
    return "🔥 Perfect score! You're a Unit Circle master!";
};

export default function UnitCircleExplorer() {
  const [angleRad, setAngleRad] = useState<number>(Math.PI / 4);
  const [showCheatOverlay, setShowCheatOverlay] = useState<boolean>(false);

  // Game Mode State
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [targetAngleRad, setTargetAngleRad] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [turn, setTurn] = useState<number>(1);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState<boolean | null>(null);
  const [isGameInteractionLocked, setIsGameInteractionLocked] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  const previousTargetAngleRef = useRef<number | null>(null);

  // Memoized version of getPerformanceFeedback
  const memoizedGetPerformanceFeedback = useCallback(getPerformanceFeedback, []);

  // Sets up a new active turn (not game over)
  const startNewActiveTurn = useCallback(() => {
    const newTarget = getRandomAngleByDifficulty(turn, previousTargetAngleRef.current);
    setTargetAngleRad(newTarget);
    previousTargetAngleRef.current = newTarget;
    
    // Only reset feedback if it's for a new turn, not if game over message is showing
    if (!isGameOver) {
        setGameFeedback(null); 
        setIsGuessCorrect(null);
    }
    setIsGameInteractionLocked(false); 
  }, [turn, isGameOver]); // Depends on turn (for difficulty) and isGameOver (for feedback clearing)

  // useEffect to manage game progression triggered by gameMode or turn changes
  useEffect(() => {
    if (!gameMode) return;

    if (turn > MAX_TURNS_UNIT_CIRCLE) {
        // Handle Game Over only if not already set to avoid re-triggering feedback
        if (!isGameOver) {
            setIsGameOver(true);
            setIsGameInteractionLocked(true);
            const finalMessage = memoizedGetPerformanceFeedback(correctCount, MAX_TURNS_UNIT_CIRCLE);
            setGameFeedback(`Game Over! You scored ${correctCount} / ${MAX_TURNS_UNIT_CIRCLE}. ${finalMessage}`);
            setIsGuessCorrect(null);
        }
    } else {
        // If not game over, start the active turn.
        setIsGameOver(false); // Ensure game over is false if we are starting/in a turn
        startNewActiveTurn();
    }
  }, [gameMode, turn, correctCount, isGameOver, memoizedGetPerformanceFeedback, startNewActiveTurn]);

  // useEffect for gameMode toggle to initialize/reset game
  useEffect(() => {
    if (gameMode) {
        setTurn(1); // This will trigger the main game progression useEffect
        setCorrectCount(0);
        setIsGameOver(false); 
        setIsGameInteractionLocked(false);
        previousTargetAngleRef.current = null;
        setGameFeedback(null); 
        setIsGuessCorrect(null);
    } else {
      // Reset states when exiting game mode
      setTargetAngleRad(null);
      setGameFeedback(null);
      setIsGuessCorrect(null);
      setIsGameInteractionLocked(false);
      // setTurn(1); // Not strictly needed to reset turn here as gameMode=false disables game logic
      // setCorrectCount(0); // Already handled
      setIsGameOver(false);
    }
  }, [gameMode]);


  const handleAngleChange = (newAngle: number) => {
    if (!isGameInteractionLocked) {
      setAngleRad(newAngle);
    }
  };
  
  const handleLockIn = () => {
    if (targetAngleRad === null || isGameInteractionLocked || isGameOver) return;

    setIsGameInteractionLocked(true); 
    const { match, errorDegrees } = checkAngleMatch(angleRad, targetAngleRad, true);

    let turnFeedbackMsg = "";
    if (match) {
      setCorrectCount(prev => prev + 1);
      setIsGuessCorrect(true);
      turnFeedbackMsg = `Correct! Target was ${formatAngleToPiString(targetAngleRad)}. Error: ${errorDegrees.toFixed(1)}°.`;
    } else {
      setIsGuessCorrect(false);
      turnFeedbackMsg = `Incorrect. Target was ${formatAngleToPiString(targetAngleRad)}. Your error: ${errorDegrees.toFixed(1)}°.`;
    }
    setGameFeedback(turnFeedbackMsg);

    setTimeout(() => {
      // The main useEffect (watching 'turn') will handle game over or starting the next active turn.
      setTurn(prevTurn => prevTurn + 1); 
    }, 2500); 
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
                Angle &amp; Trig Values
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

          {gameMode && ( 
            <UnitCircleGamePanel
              targetAngleRad={targetAngleRad ?? 0} 
              onLockIn={handleLockIn}
              correctCount={correctCount}
              maxTurns={MAX_TURNS_UNIT_CIRCLE}
              turn={turn}
              feedbackMessage={gameFeedback}
              isCorrect={isGuessCorrect}
              isGameInteractionLocked={isGameInteractionLocked}
              isGameOver={isGameOver}
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