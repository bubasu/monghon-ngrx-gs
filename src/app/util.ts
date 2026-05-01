import { DramaIndicator, Game } from './model';
import { Rational } from './rational';

export class Util {
  static percentGood(game: Game): number {
    // Anzahl der richtigen Buchstaben im Vergleich zur Länge vom
    return 0;
  }

  static countGuessedChars(word: string): number {
    return word.split('').filter(c => c !== '_').length;
  }

  static deriveDrama(game: Game): DramaIndicator {
    return {
      danger: new Rational(game.cntIncorrectGuesses, game.maxCntIncorrectGuesses),
      defense: new Rational(Util.countGuessedChars(game.guessedWord), game.targetWord.length),
    }
  }
}
