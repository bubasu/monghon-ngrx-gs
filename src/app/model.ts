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

export class GameUtil {
  static percentGood(game: Game): number {
    // Anzahl der richtigen Buchstaben im Vergleich zur Länge vom
    return 0;
  }
}


