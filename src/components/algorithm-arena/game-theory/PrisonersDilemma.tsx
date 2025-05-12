
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StrategySelector from './StrategySelector';
import ArenaFeedback from '@/components/algorithm-arena/shared/ArenaFeedback';
import ArenaControls from '@/components/algorithm-arena/shared/ArenaControls'; // Added
import StepByStepExplanation from '@/components/algorithm-arena/shared/StepByStepExplanation'; // Added
import { DilemmaChoice, RoundResult, PlayerStrategy, prisonersDilemmaPayoffs, GameRound } from './GameTheoryEngine';
import { Users, Check, X, RotateCcw, Play } from 'lucide-react';

// Example AI Strategies (could be moved to GameTheoryEngine.ts)
const ALWAYS_COOPERATE: PlayerStrategy = {
  name: 'Always Cooperate',
  choose: () => 'Cooperate',
};
const ALWAYS_DEFECT: PlayerStrategy = {
  name: 'Always Defect',
  choose: () => 'Defect',
};
const TIT_FOR_TAT: PlayerStrategy = {
  name: 'Tit-for-Tat',
  choose: (history) => (history.length === 0 ? 'Cooperate' : history[history.length - 1].playerAChoice), // Assumes player A is the user
};

const AI_STRATEGIES: Record<string, PlayerStrategy> = {
  alwaysCooperate: ALWAYS_COOPERATE,
  alwaysDefect: ALWAYS_DEFECT,
  titForTat: TIT_FOR_TAT,
};
const DEFAULT_AI_STRATEGY = 'titForTat';
const MAX_ROUNDS = 10;


export default function PrisonersDilemma() {
  const [playerChoice, setPlayerChoice] = useState<DilemmaChoice | null>(null);
  const [opponentStrategyId, setOpponentStrategyId] = useState<string>(DEFAULT_AI_STRATEGY);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null);
  const [showExplanationPanel, setShowExplanationPanel] = useState(true);
  const [gamePhase, setGamePhase] = useState<'playing' | 'results' | 'gameOver'>('playing');

  const opponentStrategy = AI_STRATEGIES[opponentStrategyId];

  const playRound = useCallback(() => {
    if (!playerChoice || !opponentStrategy || gamePhase !== 'playing') return;

    const opponentChoice = opponentStrategy.choose(history);
    const game = new GameRound(playerChoice, opponentChoice);
    const [playerPayoff, opponentPayoff] = game.getPayoffs();

    const newRoundResult: RoundResult = {
      playerAChoice: playerChoice,
      playerBChoice: opponentChoice,
      playerAPayoff: playerPayoff,
      playerBPayoff: opponentPayoff,
    };

    setHistory(prev => [...prev, newRoundResult]);
    setPlayerScore(prev => prev + playerPayoff);
    setOpponentScore(prev => prev + opponentPayoff);
    setFeedback({
        type: 'info',
        title: `Round ${currentRound} Result`,
        message: `You Chose: ${playerChoice}, Opponent Chose: ${opponentChoice}. Your Payoff: ${playerPayoff}, Opponent Payoff: ${opponentPayoff}.`
    });
    setGamePhase('results');
  }, [playerChoice, opponentStrategy, history, currentRound, gamePhase]);
  
  const nextRound = () => {
    if (currentRound < MAX_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      setPlayerChoice(null);
      setFeedback(null);
      setGamePhase('playing');
    } else {
      setGamePhase('gameOver');
      setFeedback({
          type: 'success', // or 'info'
          title: 'Game Over!',
          message: `Final Score - You: ${playerScore + (history.length > 0 && history[history.length-1].playerAPayoff || 0) }, Opponent: ${opponentScore + (history.length > 0 && history[history.length-1].playerBPayoff || 0) }`
      });
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setCurrentRound(1);
    setHistory([]);
    setPlayerScore(0);
    setOpponentScore(0);
    setFeedback(null);
    setGamePhase('playing');
  };
  
  const explanationContent = (
    <>
        <p className="font-semibold">The Prisoner's Dilemma:</p>
        <p className="text-xs mb-2">
            Two members of a criminal gang are arrested and imprisoned. Each prisoner is in solitary confinement with no means of communicating with the other. Prosecutors lack sufficient evidence to convict the pair on the principal charge, but they have enough to convict both on a lesser charge.
        </p>
        <ul className="list-disc list-inside text-xs space-y-1 mb-2">
            <li>If A and B both betray the other, each of them serves 2 years in prison (Payoff: 1,1).</li>
            <li>If A betrays B but B remains silent, A will be set free and B will serve 3 years in prison (Payoff: 5,0 for A).</li>
            <li>If A remains silent but B betrays A, A will serve 3 years and B will be set free (Payoff: 0,5 for A).</li>
            <li>If A and B both remain silent, both of them will only serve 1 year in prison (on the lesser charge) (Payoff: 3,3).</li>
        </ul>
         <p className="text-xs">Payoffs are reversed for prison years (higher payoff = better outcome / less years). Here: Cooperate = Remain Silent, Defect = Betray.</p>
    </>
);


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-7 h-7 text-primary"/> Prisoner's Dilemma
        </CardTitle>
        <CardDescription>
            {gamePhase === 'gameOver' ? 'Game Over. See final scores below.' : `Round ${currentRound}/${MAX_ROUNDS}. Your Score: ${playerScore}, Opponent Score: ${opponentScore}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg mb-2">Payoff Matrix</CardTitle>
                <table className="w-full text-xs text-center border-collapse">
                    <thead>
                        <tr><th/> <th colSpan={2} className="border p-1">Opponent's Choice</th></tr>
                        <tr><th className="border p-1">Your Choice</th> <th className="border p-1">Cooperate</th> <th className="border p-1">Defect</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="font-semibold border p-1">Cooperate</td>
                            <td className="border p-1">{prisonersDilemmaPayoffs.Cooperate.Cooperate.join(', ')}</td>
                            <td className="border p-1">{prisonersDilemmaPayoffs.Cooperate.Defect.join(', ')}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold border p-1">Defect</td>
                            <td className="border p-1">{prisonersDilemmaPayoffs.Defect.Cooperate.join(', ')}</td>
                            <td className="border p-1">{prisonersDilemmaPayoffs.Defect.Defect.join(', ')}</td>
                        </tr>
                    </tbody>
                </table>
                 <p className="text-xs mt-1 text-muted-foreground">(Your Score, Opponent's Score)</p>
            </Card>
             <StrategySelector
                selectedStrategy={opponentStrategyId}
                onStrategyChange={setOpponentStrategyId}
                disabled={gamePhase !== 'playing'}
            />
          </div>
         
          <div className="space-y-4">
            <Card className="bg-card p-4 shadow-md">
                <CardTitle className="text-lg mb-3">Your Move for Round {currentRound}</CardTitle>
                 <div className="flex gap-3">
                    <Button 
                        onClick={() => setPlayerChoice('Cooperate')}
                        disabled={gamePhase !== 'playing'}
                        variant={playerChoice === 'Cooperate' ? 'default' : 'outline'}
                        className="w-full"
                    >
                        <Check className="mr-2 h-4 w-4"/> Cooperate
                    </Button>
                    <Button 
                        onClick={() => setPlayerChoice('Defect')}
                        disabled={gamePhase !== 'playing'}
                        variant={playerChoice === 'Defect' ? 'destructive' : 'outline'}
                        className="w-full"
                    >
                         <X className="mr-2 h-4 w-4"/> Defect
                    </Button>
                 </div>
            </Card>

            {feedback && (
              <ArenaFeedback type={feedback.type} title={feedback.title} message={feedback.message} />
            )}
          </div>
        </div>
        
        <ArenaControls
          onPlay={gamePhase === 'playing' && playerChoice ? playRound : gamePhase === 'results' ? nextRound : gamePhase === 'gameOver' ? resetGame : undefined}
          onReset={resetGame}
          isPlaying={gamePhase !== 'playing'} // "Play" button becomes "Next Round" or "Play Again"
          canPlay={gamePhase === 'playing' ? !!playerChoice : true}
          canPause={false} // No pause functionality in this simple version
          onToggleExplanation={() => setShowExplanationPanel(prev => !prev)}
        />
        
        <StepByStepExplanation
            isOpen={showExplanationPanel}
            title="About Prisoner's Dilemma"
            currentStepExplanation={explanationContent}
        />

        {history.length > 0 && (
            <Card className="mt-4">
                <CardHeader><CardTitle className="text-md">Round History</CardTitle></CardHeader>
                <CardContent className="max-h-40 overflow-y-auto text-xs space-y-1">
                    {history.map((h, i) => (
                        <p key={i} className="p-1 bg-muted/20 rounded text-muted-foreground">
                            R{i+1}: You: {h.playerAChoice} ({h.playerAPayoff}), Opp: {h.playerBChoice} ({h.playerBPayoff})
                        </p>
                    )).reverse()}
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
