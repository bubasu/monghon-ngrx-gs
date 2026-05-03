import { Injectable, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Dynamic, GamePhase, Scenario } from './model';

interface GuessNarrationInput {
  letter: string;
  hit: boolean;
  phase: GamePhase;
  dynamic: Dynamic;
  scenario: Scenario;
}

@Injectable({ providedIn: 'root' })
export class NarratorService {
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  async announceGuess(input: GuessNarrationInput): Promise<void> {
    const message = [
      input.hit ? `Hit with ${input.letter}.` : `${input.letter} is not in the word.`,
      `Mistakes ${input.dynamic.cntBad} of ${input.dynamic.maxBad}.`,
      this.describeIllustration(input.scenario, input.dynamic),
      this.describePhase(input.phase),
    ].join(' ');

    const politeness = input.phase === 'Won' || input.phase === 'Lost' ? 'assertive' : 'polite';
    await this.liveAnnouncer.clear();
    await this.liveAnnouncer.announce(message, politeness, 2200);
  }

  private describePhase(phase: GamePhase): string {
    if (phase === 'Won') {
      return 'Game won.';
    }

    if (phase === 'Lost') {
      return 'Game lost.';
    }

    return 'Game in progress.';
  }

  private describeIllustration(scenario: Scenario, dynamic: Dynamic): string {
    switch (scenario) {
      case Scenario.HANGMAN:
        return `Hangman: ${dynamic.cntBad} of ${dynamic.maxBad} parts visible.`;
      case Scenario.FLOWER:
        return `Flower: ${Math.max(dynamic.maxBad - dynamic.cntBad, 0)} parts still intact.`;
      case Scenario.BOMB:
        if (dynamic.cntBad >= dynamic.maxBad) {
          return 'Bomb: explosion shown.';
        }
        return `Bomb: fuse progress ${dynamic.cntBad} of ${dynamic.maxBad}.`;
      case Scenario.HAIR:
        return `Hair: ${Math.max(dynamic.maxBad - dynamic.cntBad, 0)} of ${dynamic.maxBad} strands remaining.`;
      default:
        return 'Illustration updated.';
    }
  }
}
