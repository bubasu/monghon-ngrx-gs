import { Rational } from './rational';

export type GamePhase = 'Initial' | 'Playing' | 'Won' | 'Lost';

export interface Game {
  phase: GamePhase;
  targetWord: string;
  guessedWord: string;
  cntIncorrectGuesses: number;
  maxCntIncorrectGuesses: number;
}

export interface GameContext {
  game: Game;
}

export interface DramaIndicator {
  danger: Rational;
  defense: Rational;
}

export enum StoryEnum {
  HANGMAN = 'Hangman', TRAIN_ACCIDENT = 'Train Accident',
}


