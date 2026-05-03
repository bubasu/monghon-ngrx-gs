export type GamePhase = 'Initial' | 'Playing' | 'Won' | 'Lost';

export interface Game {
  phase: GamePhase;
  targetWord: string;
  guessedWord: string;
  cntIncorrectGuesses: number;
  maxCntIncorrectGuesses: number;
}

export interface Dynamic {
  cntBad: number,
  maxBad: number,
  cntGood: number,
  maxGood: number,
}

export enum Scenario {
  HANGMAN = 'Hangman',
  FLOWER = 'Flower',
  BOMB = 'Bomb',
  HAIR = 'Hair',
}
