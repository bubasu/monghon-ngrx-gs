import { Component, computed, input } from '@angular/core';
import { DramaIndicator, StoryEnum } from '../model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-illustration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './illustration.html',
  styleUrl: './illustration.css',
})
export class Illustration {
  story = input<StoryEnum>();
  drama = input<DramaIndicator>();

  // Zugriff auf das Enum im Template ermöglichen
  protected readonly StoryEnum = StoryEnum;

  // Berechnet, wie viele "Fehler-Teile" gezeichnet werden sollen
  protected errorSteps = computed(() => {
    const d = this.drama();
    if (!d) return 0;
    // Wir nehmen an, dass das Hangman-SVG 10 Schritte hat.
    // drama().danger ist ein Rational (cntIncorrectGuesses / maxCntIncorrectGuesses).
    // Da maxCntIncorrectGuesses im game.state auf 11 gesetzt ist,
    // mappen wir das Verhältnis auf unsere 10 SVG-Schritte.
    return Math.floor(d.danger.toDouble() * 10);
  });
}
