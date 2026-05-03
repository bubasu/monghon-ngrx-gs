import { Dynamic, Game } from './model';

export class Util {

  private static countGuessedChars(word: string): number {
    return word.split('').filter((c) => c !== '_').length;
  }

  static deriveDynamic(game: Game): Dynamic {
    return {
      cntBad: game.cntIncorrectGuesses,
      maxBad: game.maxCntIncorrectGuesses,
      cntGood: Util.countGuessedChars(game.guessedWord),
      maxGood: game.targetWord.length,
    };
  }
}
