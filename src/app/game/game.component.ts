import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions, gameFeature } from '../game.state';
import { FormsModule } from '@angular/forms';
import { WheelPickerComponent } from '../wheel-picker/wheel-picker.component';
import { Illustration } from '../illustration/illustration';
import { Util } from '../util';
import { Scenario } from '../model';
import { NarratorService } from '../narrator.service';

const SCENARIO_LABELS: Record<Scenario, string> = {
  [Scenario.HANGMAN]: 'Hangman',
  [Scenario.FLOWER]: 'Flower',
  [Scenario.BOMB]: 'Bomb',
  [Scenario.HAIR]: 'Hair',
};

@Component({
  selector: 'app-game',
  imports: [FormsModule, WheelPickerComponent, Illustration],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, AfterViewInit {
  private readonly store = inject(Store);
  private readonly narrator = inject(NarratorService);
  @ViewChild(WheelPickerComponent) private wheelPicker?: WheelPickerComponent;
  @ViewChild('guessLetterBtn') private guessLetterBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('gameContainer') private gameContainer?: ElementRef<HTMLElement>;
  @ViewChild('scenarioSelect') private scenarioSelect?: ElementRef<HTMLSelectElement>;

  game = this.store.selectSignal(gameFeature.selectGameState);
  protected letter = signal('');

  protected readonly alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  protected allScenarios = Object.values(Scenario);
  protected selectedScenario = signal(Scenario.HANGMAN);
  protected SCENARIO_LABELS = SCENARIO_LABELS;

  private readonly pendingNarrationLetter = signal<string | null>(null);
  private readonly previousGuessedWord = signal('');
  private readonly previousCntIncorrectGuesses = signal(0);
  private readonly hasNarrationBaseline = signal(false);

  constructor() {
    effect(
      () => {
        const state = this.game();
        const pendingLetter = this.pendingNarrationLetter();
        const guessedWord = state.guessedWord;
        const cntIncorrectGuesses = state.cntIncorrectGuesses;

        if (!this.hasNarrationBaseline()) {
          this.previousGuessedWord.set(guessedWord);
          this.previousCntIncorrectGuesses.set(cntIncorrectGuesses);
          this.hasNarrationBaseline.set(true);
          return;
        }

        const previousWord = this.previousGuessedWord();
        const previousCntBad = this.previousCntIncorrectGuesses();
        const hasRelevantGameChange = guessedWord !== previousWord || cntIncorrectGuesses !== previousCntBad;

        if (pendingLetter && hasRelevantGameChange) {
          this.narrator.announceGuess({
            letter: pendingLetter,
            hit: guessedWord !== previousWord,
            phase: state.phase,
            dynamic: Util.deriveDynamic(state),
            scenario: this.selectedScenario(),
          });
          this.pendingNarrationLetter.set(null);
        }

        if (hasRelevantGameChange || pendingLetter) {
          this.previousGuessedWord.set(guessedWord);
          this.previousCntIncorrectGuesses.set(cntIncorrectGuesses);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.startNewGame();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.focusGameContainer());
  }

  startNewGame() {
    this.pendingNarrationLetter.set(null);
    this.store.dispatch(GameActions.newGame());
    queueMicrotask(() => this.focusGameContainer());
  }

  guessLetter() {
    const letter = this.letter().toUpperCase();
    if (!letter) {
      return;
    }

    const state = this.game();
    if (state.phase !== 'Playing') {
      return;
    }

    const normalizedTargetWord = state.targetWord.toUpperCase();
    const isHit = normalizedTargetWord.includes(letter);
    const isAlreadyRevealed = state.guessedWord.includes(letter);

    if (isHit && isAlreadyRevealed) {
      return;
    }

    this.pendingNarrationLetter.set(letter);
    this.store.dispatch(GameActions.guessLetter({ letter }));
  }

  setLetter(letter: string) {
    this.letter.set(letter);
  }

  protected onGameKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.handleTabWrapping(event);
      return;
    }

    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || target.isContentEditable) {
        return;
      }
    }

    if (event.key === 'Enter') {
      if (this.letter()) {
        event.preventDefault();
        this.triggerGuessButtonPress();
      }
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      const letter = event.key.toUpperCase();
      if (this.wheelPicker?.selectByValue(letter)) {
        this.setLetter(letter);
        event.preventDefault();
      }
    }
  }

  protected dynamic() {
    return Util.deriveDynamic(this.game());
  }

  private triggerGuessButtonPress() {
    const button = this.guessLetterBtn?.nativeElement;
    if (!button) {
      this.guessLetter();
      return;
    }

    button.classList.add('is-pressed');
    button.click();
    window.setTimeout(() => button.classList.remove('is-pressed'), 120);
  }

  private focusGameContainer() {
    this.gameContainer?.nativeElement.focus();
  }

  private handleTabWrapping(event: KeyboardEvent) {
    const activeElement = document.activeElement;
    const select = this.scenarioSelect?.nativeElement;
    const guessButton = this.guessLetterBtn?.nativeElement;
    const wheelIsFocused = this.wheelPicker?.isPickerFocused(activeElement) ?? false;

    if (!event.shiftKey && activeElement === guessButton) {
      event.preventDefault();
      select?.focus();
      return;
    }

    if (event.shiftKey && activeElement === select) {
      event.preventDefault();
      guessButton?.focus();
      return;
    }

    if (!event.shiftKey && activeElement === select) {
      event.preventDefault();
      this.wheelPicker?.focusPicker();
      return;
    }

    if (event.shiftKey && wheelIsFocused) {
      event.preventDefault();
      select?.focus();
      return;
    }

    if (!event.shiftKey && wheelIsFocused) {
      event.preventDefault();
      guessButton?.focus();
      return;
    }

    if (event.shiftKey && activeElement === guessButton) {
      event.preventDefault();
      this.wheelPicker?.focusPicker();
    }
  }
}
