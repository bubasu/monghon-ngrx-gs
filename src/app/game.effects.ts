import { inject } from '@angular/core';
import { RandomWordService } from './random-word.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameActions } from './game.state';
import { catchError, exhaustMap, map, of } from 'rxjs';

export const fetchRandomWordEffect = createEffect(
  (actions$ = inject(Actions), randomWordService = inject(RandomWordService)) => {
    return actions$.pipe(
      ofType(GameActions.newGame),
      exhaustMap(() =>
        randomWordService.fetchWord().pipe(
          map((word) => GameActions.fetchWordSucceeded({ word })),
          catchError((error) => of(GameActions.fetchWordFailed({ error }))),
        ),
      ),
    );
  },
  {
    functional: true,
  },
);
