import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions } from '../state';
import { Game } from '../model';
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
  private readonly store: Store<Game> = inject(Store);
  game = this.store.selectSignal((state) => state);
  protected guessedLetter = signal('');

  startNewGame() {
    this.store.dispatch(GameActions.newGame({ word: 'monghon' }));
  }

  guessLetter() {
    this.store.dispatch(GameActions.guessLetter({ letter: 'a' }));
  }
}
