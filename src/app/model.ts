export type GamePhase = 'Initial' | 'Playing' | 'Won' | 'Lost';

export interface Game {
  phase: GamePhase;
  targetWord: string;
  guessedWord: string;
  cntCorrectGuesses: number;
  cntIncorrectGuesses: number;
  maxCntIncorrectGuesses: number;
}


