
/**
 * @file GameTheoryEngine.ts
 * Contains the core logic for game theory simulations,
 * such as defining strategies, calculating payoffs, and managing game rounds.
 */

// Example type for a player's choice in Prisoner's Dilemma
export type DilemmaChoice = 'Cooperate' | 'Defect';

// Example type for a round's history
export interface RoundResult {
  playerAChoice: DilemmaChoice;
  playerBChoice: DilemmaChoice;
  playerAPayoff: number;
  playerBPayoff: number;
}

// Example interface for a player strategy
export interface PlayerStrategy {
  name: string;
  // Takes history of previous rounds and decides the next move
  choose: (history: RoundResult[]) => DilemmaChoice;
}

// Example payoff matrix for Prisoner's Dilemma
// [Player A's payoff, Player B's payoff]
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

// This is a very basic structure. 
// A full engine would have methods to run multiple rounds,
// manage different strategies, calculate cumulative scores, etc.
// console.log("GameTheoryEngine loaded. (Placeholder)");
