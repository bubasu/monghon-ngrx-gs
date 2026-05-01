import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameActions, gameFeature } from '../game.state';
import { FormsModule } from '@angular/forms';
import { WheelPickerComponent } from '../wheel-picker/wheel-picker.component';
import { RandomWordService } from '../random-word.service';
import { Illustration } from '../illustration/illustration';
import { JsonPipe } from '@angular/common';
import { Util } from '../util';
import { StoryEnum } from '../model';

const STORY_LABELS: Record<StoryEnum, string> = {
  [StoryEnum.HANGMAN]: 'Hangman',
  [StoryEnum.TRAIN_ACCIDENT]: 'Train Accident',
};

@Component({
  selector: 'app-game',
  imports: [
    FormsModule,
    WheelPickerComponent,
    Illustration,
    JsonPipe
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private readonly store = inject(Store);
  private randomWordService = inject(RandomWordService);
  game = this.store.selectSignal(gameFeature.selectGameState);
  protected guessedLetter = signal('');

  protected readonly alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i));

  protected allStories = Object.values(StoryEnum);
  protected selectedStory = signal(StoryEnum.HANGMAN);
  protected STORY_LABELS = STORY_LABELS;

  startNewGame() {
    this.store.dispatch(GameActions.newGame());
  }

  guessLetter() {
    this.store.dispatch(GameActions.guessLetter({ letter: this.guessedLetter() }));
    // this.guessedLetter.set('');
  }

  onOptionPicked($event: string) {
    this.guessedLetter.set($event);
  }

  protected fetchRandomWord() {
    this.randomWordService.fetchWord().subscribe(data => {
      console.log(data);
    })
  }

  protected story() {
    return StoryEnum.HANGMAN; // TODO from select
  }

  protected drama() {
    return Util.deriveDrama(this.game());
  }
}
