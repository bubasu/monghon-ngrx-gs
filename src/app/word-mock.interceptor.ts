import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const MOCK_WORDS = [
  'SOUL', 'MIST', 'VOID', 'ECHO', 'GATE',
  'DREAM', 'MIRAGE', 'SPIRIT', 'SILENCE', 'PHANTOM',
  'JOURNEY', 'SHADOW', 'VESSEL', 'AWAKENING', 'REFLECTION',
  'LABYRINTH', 'ETHEREAL', 'DIMENSION', 'REVERIE', 'SOLITUDE'
];

export const wordMockInterceptor: HttpInterceptorFn = (req, next) => {
  // Check whether the URL matches the random-word API
  if (req.url.includes('random-word-api.herokuapp.com')) {
    console.log('Mocking request for:', req.url);

    // Select a random word
    const randomIndex = Math.floor(Math.random() * MOCK_WORDS.length);
    const randomWord = MOCK_WORDS[randomIndex];

    // Return a simulated response as an array (because the API returns [ "word" ])
    return of(
      new HttpResponse({
        status: 200,
        body: [randomWord],
      }),
    ).pipe(delay(500)); // Short delay for realism
  }

  // Forward all other requests normally
  return next(req);
};
