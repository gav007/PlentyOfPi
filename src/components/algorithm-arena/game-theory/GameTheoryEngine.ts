
/**
 * @file GameTheoryEngine.ts
 * Contains the core logic for game theory simulations,
 * such as defining strategies, calculating payoffs, and managing game rounds.
 */

// Player's choice in Prisoner's Dilemma
export type DilemmaChoice = 'Cooperate' | 'Defect';

// Result of a single round
export interface RoundResult {
  playerAChoice: DilemmaChoice; // Player A (User)
  playerBChoice: DilemmaChoice; // Player B (AI)
  playerAPayoff: number;
  playerBPayoff: number;
}

// Interface for a player strategy
export interface PlayerStrategy {
  name: string;
  id: string; // Added id for easier mapping
  // Takes history of previous rounds and decides the next move for Player B (AI)
  // Player A is the user, Player B is the AI opponent.
  choose: (history: RoundResult[], playerAChoices: DilemmaChoice[]) => DilemmaChoice;
}

// Payoff matrix for Prisoner's Dilemma: [Player A's payoff, Player B's payoff]
export const prisonersDilemmaPayoffs = {
  Cooperate: {
    Cooperate: [3, 3], // Both cooperate
    Defect: [0, 5],    // A cooperates, B defects
  },
  Defect: {
    Cooperate: [5, 0],    // A defects, B cooperates
    Defect: [1, 1],       // Both defect
  },
};

export class GameRound {
  constructor(
    public playerAChoice: DilemmaChoice,
    public playerBChoice: DilemmaChoice
  ) {}

  getPayoffs(): [number, number] {
    return prisonersDilemmaPayoffs[this.playerAChoice][this.playerBChoice];
  }
}

// AI Strategies
export const ALWAYS_COOPERATE_STRATEGY: PlayerStrategy = {
  name: 'Always Cooperate',
  id: 'alwaysCooperate',
  choose: () => 'Cooperate',
};

export const ALWAYS_DEFECT_STRATEGY: PlayerStrategy = {
  name: 'Always Defect',
  id: 'alwaysDefect',
  choose: () => 'Defect',
};

export const TIT_FOR_TAT_STRATEGY: PlayerStrategy = {
  name: 'Tit-for-Tat',
  id: 'titForTat',
  // AI (Player B) mimics Player A's last move. Cooperates on first round.
  choose: (history, playerAChoices) => {
    if (playerAChoices.length === 0) {
      return 'Cooperate';
    }
    return playerAChoices[playerAChoices.length - 1];
  },
};

export const RANDOM_CHOICE_STRATEGY: PlayerStrategy = {
  name: 'Random Choice',
  id: 'random',
  choose: () => (Math.random() < 0.5 ? 'Cooperate' : 'Defect'),
};

export const ALL_AI_STRATEGIES: PlayerStrategy[] = [
    ALWAYS_COOPERATE_STRATEGY,
    ALWAYS_DEFECT_STRATEGY,
    TIT_FOR_TAT_STRATEGY,
    RANDOM_CHOICE_STRATEGY,
];

export const AI_STRATEGIES_MAP: Record<string, PlayerStrategy> = ALL_AI_STRATEGIES.reduce((acc, strategy) => {
    acc[strategy.id] = strategy;
    return acc;
}, {} as Record<string, PlayerStrategy>);
