import { Game } from './model';
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';

export const GameActions = createActionGroup({
  source: 'Game',
  events: {
    'newGame': emptyProps(),
    'fetchWordSucceeded': props<{word: string}>(),
    'fetchWordFailed': props<{error: string}>(),
    'guessLetter': props<{letter: string}>(),
  },
});

export const initialGameState: Game = {
  phase: 'Initial',
  targetWord: '',
  guessedWord: '',
  cntIncorrectGuesses: 0,
  maxCntIncorrectGuesses: 11,
}

export const gameReducer = createReducer(
  initialGameState,
  on(GameActions.fetchWordSucceeded, (state, { word  }) =>
    ({ ...state, phase: 'Playing', targetWord: word, guessedWord: '_'.repeat(word.length), cntIncorrectGuesses: 0 })),
  on(GameActions.guessLetter, (state, { letter }) => {
    const guessedWordAsArray = [ ...state.guessedWord ];
    let foundLetter = false;
    for (let i = 0; i < state.targetWord.length; i++) {
      if (state.targetWord[i].toUpperCase() === letter.toUpperCase()) {
        guessedWordAsArray[i] = letter.toUpperCase();
        foundLetter = true;
      }
    }
    const newState = { ...state };
    if (foundLetter) {
      newState.guessedWord = guessedWordAsArray.join('');
      if (newState.guessedWord.indexOf('_') === -1) {
        newState.phase = 'Won';
      }
    } else {
      newState.cntIncorrectGuesses++;
      if (newState.cntIncorrectGuesses >= newState.maxCntIncorrectGuesses) {
        newState.phase = 'Lost';
      }
    }
    return newState;
  }),
);

export const gameFeature = createFeature({
  name: 'game',
  reducer: gameReducer
});


