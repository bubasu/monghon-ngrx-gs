import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  template: `
    <app-game></app-game>
  `,
})
export class App {
}
