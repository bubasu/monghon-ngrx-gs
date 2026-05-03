import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions, gameFeature } from '../game.state';
import { FormsModule } from '@angular/forms';
import { WheelPickerComponent } from '../wheel-picker/wheel-picker.component';
import { Illustration } from '../illustration/illustration';
import { Util } from '../util';
import { Scenario } from '../model';

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
export class GameComponent implements OnInit {
  private readonly store = inject(Store);
  game = this.store.selectSignal(gameFeature.selectGameState);
  protected letter = signal('');

  protected readonly alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  protected allScenarios = Object.values(Scenario);
  protected selectedScenario = signal(Scenario.HANGMAN);
  protected SCENARIO_LABELS = SCENARIO_LABELS;

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame() {
    this.store.dispatch(GameActions.newGame());
  }

  guessLetter() {
    this.store.dispatch(GameActions.guessLetter({ letter: this.letter() }));
  }

  setLetter(letter: string) {
    this.letter.set(letter);
  }

  protected dynamic() {
    return Util.deriveDynamic(this.game());
  }
}
