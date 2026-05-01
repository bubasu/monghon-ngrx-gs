import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const MOCK_WORDS = [
  'ANGULAR',
  'TYPESCRIPT',
  'PROGRAMMIERUNG',
  'REAKTIVITAET',
  'SIGNAL',
  'INTERCEPTOR',
  'FRONTEND',
  'ENTWICKLUNG',
  'KOMPONENTE',
  'SOFTWARE',
];

export const wordMockInterceptor: HttpInterceptorFn = (req, next) => {
  // Prüfen, ob die URL der Random-Word-API entspricht
  if (req.url.includes('random-word-api.herokuapp.com')) {
    console.log('Mocking request for:', req.url);

    // Zufälliges Wort auswählen
    const randomIndex = Math.floor(Math.random() * MOCK_WORDS.length);
    const randomWord = MOCK_WORDS[randomIndex];

    // Simulierte Antwort als Array zurückgeben (da die API [ "word" ] liefert)
    return of(
      new HttpResponse({
        status: 200,
        body: [randomWord],
      }),
    ).pipe(delay(500)); // Kurze Verzögerung für Realismus
  }

  // Alle anderen Anfragen normal weiterleiten
  return next(req);
};
