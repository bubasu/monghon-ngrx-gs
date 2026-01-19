import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions, selectGameState } from '../state';
import { FormsModule } from '@angular/forms';
import { WheelPickerComponent } from '../wheel-picker/wheel-picker.component';

@Component({
  selector: 'app-game',
  imports: [
    FormsModule,
    WheelPickerComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private readonly store = inject(Store);
  game = this.store.selectSignal(selectGameState);
  protected guessedLetter = signal('');

  protected readonly alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i));

  startNewGame() {
    this.store.dispatch(GameActions.newGame({ word: 'monghon' }));
  }

  guessLetter() {
    this.store.dispatch(GameActions.guessLetter({ letter: this.guessedLetter() }));
    this.guessedLetter.set('');
  }
}
