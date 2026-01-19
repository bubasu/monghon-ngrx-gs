import { Game } from './model';
import { createActionGroup, createFeatureSelector, createReducer, on, props } from '@ngrx/store';

export const GameActions = createActionGroup({
  source: 'Game',
  events: {
    'newGame': props<{word: string}>(),
    'guessLetter': props<{letter: string}>(),
  },
});

export const initialState: Game = {
  phase: 'Initial',
  targetWord: '',
  guessedWord: '',
  cntCorrectGuesses: 0,
  cntIncorrectGuesses: 0,
  maxCntIncorrectGuesses: 10,
}

export const gameReducer = createReducer(
  initialState,
  on(GameActions.newGame, (state, { word  }) =>
    ({ ...state, phase: 'Playing', targetWord: word, guessedWord: '_'.repeat(word.length) })),
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
      newState.cntCorrectGuesses++;
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

export const selectGameState = createFeatureSelector<Game>('game');
