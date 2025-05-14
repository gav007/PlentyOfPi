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

// const SVG_SIZE = 320; // No longer needed for fixed size
const SINE_WAVE_HEIGHT = 150;
const MAX_TURNS_UNIT_CIRCLE = 10;
const FEEDBACK_DELAY_MS = 2500;


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
  const [pendingTargetAngleRad, setPendingTargetAngleRad] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [turn, setTurn] = useState<number>(1);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState<boolean | null>(null);
  const [isGameInteractionLocked, setIsGameInteractionLocked] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isShowingFeedback, setIsShowingFeedback] = useState<boolean>(false);
  
  const previousTargetAngleRef = useRef<number | null>(null);

  const memoizedGetPerformanceFeedback = useCallback(getPerformanceFeedback, []);

  const startNewActiveTurn = useCallback((currentTurn: number) => {
    const newTarget = getRandomAngleByDifficulty(currentTurn, previousTargetAngleRef.current);
    setTargetAngleRad(newTarget); 
    previousTargetAngleRef.current = newTarget;
    
    setGameFeedback(null); 
    setIsGuessCorrect(null);
    setIsGameInteractionLocked(false); 
  }, []); 

  const resetGame = useCallback(() => {
    setTurn(1);
    setCorrectCount(0);
    setIsGameOver(false);
    setIsGameInteractionLocked(false);
    setIsShowingFeedback(false);
    setGameFeedback(null);
    setIsGuessCorrect(null);
    previousTargetAngleRef.current = null;
    setPendingTargetAngleRad(null); 
  }, []);

  const handleRestartGame = () => {
    resetGame();
    startNewActiveTurn(1); 
  };

  useEffect(() => {
    if (!gameMode) return;

    if (isGameOver) { 
        return;
    }

    if (turn > MAX_TURNS_UNIT_CIRCLE) {
        setIsGameOver(true);
        setIsGameInteractionLocked(true);
        const finalMessage = memoizedGetPerformanceFeedback(correctCount, MAX_TURNS_UNIT_CIRCLE);
        setGameFeedback(`Game Over! You scored ${correctCount} / ${MAX_TURNS_UNIT_CIRCLE}. ${finalMessage}`);
        setIsGuessCorrect(null);
    } else {
        if (!isShowingFeedback) {
            startNewActiveTurn(turn);
        }
    }
  }, [gameMode, turn, isGameOver, correctCount, memoizedGetPerformanceFeedback, startNewActiveTurn, isShowingFeedback]);

  useEffect(() => {
    if (gameMode) {
       resetGame();
       startNewActiveTurn(1); 
    } else {
      setTargetAngleRad(null);
      setPendingTargetAngleRad(null);
      setGameFeedback(null);
      setIsGuessCorrect(null);
      setIsGameInteractionLocked(false);
      setIsGameOver(false);
      setIsShowingFeedback(false);
      resetGame(); 
    }
  }, [gameMode, resetGame, startNewActiveTurn]);


  const handleAngleChange = (newAngle: number) => {
    if (!isGameInteractionLocked && !isShowingFeedback) { 
      setAngleRad(newAngle);
    }
  };
  
  const handleLockIn = () => {
    if (targetAngleRad === null || isGameInteractionLocked || isGameOver || isShowingFeedback) return;

    setIsGameInteractionLocked(true); 
    setIsShowingFeedback(true); 

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

    if (turn < MAX_TURNS_UNIT_CIRCLE) {
        const nextTarget = getRandomAngleByDifficulty(turn + 1, targetAngleRad);
        setPendingTargetAngleRad(nextTarget);
    }


    setTimeout(() => {
      setIsShowingFeedback(false); 
      setIsGameInteractionLocked(false); 

      if (turn >= MAX_TURNS_UNIT_CIRCLE) {
         setTurn(prevTurn => prevTurn + 1); 
      } else {
        setTargetAngleRad(pendingTargetAngleRad);
        previousTargetAngleRef.current = pendingTargetAngleRad;
        setPendingTargetAngleRad(null);
        setGameFeedback(null);
        setIsGuessCorrect(null);
        setTurn(prevTurn => prevTurn + 1); 
      }
    }, FEEDBACK_DELAY_MS); 
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
          {/* Container for the SVG to control its max width and centering */}
          <CardContent className="flex justify-center p-2 sm:p-4">
            <div className="w-full max-w-[320px] sm:max-w-[400px]"> {/* Max width for the SVG container */}
              <UnitCircleCanvas
                angle={angleRad}
                onAngleChange={handleAngleChange}
                showCheatOverlay={showCheatOverlay}
                // size prop removed
                gameMode={gameMode}
                targetAngleRad={targetAngleRad}
                isGameInteractionLocked={isGameInteractionLocked || isShowingFeedback}
              />
            </div>
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
              isGameInteractionLocked={isGameInteractionLocked || isShowingFeedback}
              isGameOver={isGameOver}
              onRestartGame={handleRestartGame}
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
