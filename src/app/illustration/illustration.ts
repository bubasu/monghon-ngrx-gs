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
    // Wir nehmen an, dass das Hangman-SVG 11 Schritte hat.
    // drama().danger ist ein Rational (cntIncorrectGuesses / maxCntIncorrectGuesses).
    // Da maxCntIncorrectGuesses im game.state auf 11 gesetzt ist,
    // mappen wir das Verhältnis auf unsere 11 SVG-Schritte.
    return Math.floor(d.danger.toDouble() * 11);
  });

  protected getStarTransform(steps: number): string {
    // Pfad der Zündschnur: M 132 108 Q 145 90 160 100 T 185 95
    // Wir mappen die Schritte 4 bis 10 auf Positionen entlang dieses Pfades (rückwärts).
    // Schritt 4: Ende (185, 95)
    // Schritt 10: Anfang (132, 108)
    const positions = [
      { x: 185, y: 95 },  // Schritt 4
      { x: 175, y: 98 },  // Schritt 5
      { x: 165, y: 100 }, // Schritt 6
      { x: 155, y: 95 },  // Schritt 7
      { x: 145, y: 92 },  // Schritt 8
      { x: 138, y: 100 }, // Schritt 9
      { x: 132, y: 108 }  // Schritt 10
    ];

    const pos = positions[steps - 4] || positions[0];
    return `translate(${pos.x}, ${pos.y}) scale(0.5)`;
  }
}
