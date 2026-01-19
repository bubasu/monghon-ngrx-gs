import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions, selectGameState } from '../state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [
    FormsModule
  ],
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent {
  private readonly store = inject(Store);
  game = this.store.selectSignal(selectGameState);
  protected guessedLetter = signal('');

  startNewGame() {
    this.store.dispatch(GameActions.newGame({ word: 'monghon' }));
  }

  guessLetter() {
    this.store.dispatch(GameActions.guessLetter({ letter: this.guessedLetter() }));
    this.guessedLetter.set('');
  }
}
