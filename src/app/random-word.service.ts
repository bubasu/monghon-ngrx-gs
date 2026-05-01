import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomWordService {
  http = inject(HttpClient);

  fetchWord(): Observable<string> {
    return this.http
      .get<string[]>(`https://random-word-api.herokuapp.com/word?number=1`)
      .pipe(map((words) => words[0]));
  }
}
