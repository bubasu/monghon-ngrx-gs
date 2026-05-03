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

  // Make the enum accessible in the template
  protected readonly StoryEnum = StoryEnum;

  // Calculates how many "error parts" should be drawn
  protected errorSteps = computed(() => {
    const d = this.drama();
    if (!d) return 0;
    // We assume that the hangman SVG has 11 steps.
    // drama().danger is a rational number (cntIncorrectGuesses / maxCntIncorrectGuesses).
    // Since maxCntIncorrectGuesses is set to 11 in game.state,
    // we map the ratio to our 11 SVG steps.
    return Math.floor(d.danger.toDouble() * 11);
  });

  protected getStarTransform(steps: number): string {
    // Fuse path: M 132 108 Q 145 90 160 100 T 185 95
    // We map steps 4 to 10 to positions along this path (in reverse).
    // Step 4: End (185, 95)
    // Step 10: Start (132, 108)
    const positions = [
      { x: 185, y: 95 }, // Step 4
      { x: 175, y: 98 }, // Step 5
      { x: 165, y: 100 }, // Step 6
      { x: 155, y: 95 }, // Step 7
      { x: 145, y: 92 }, // Step 8
      { x: 138, y: 100 }, // Step 9
      { x: 132, y: 108 }, // Step 10
    ];

    const pos = positions[steps - 4] || positions[0];
    return `translate(${pos.x}, ${pos.y}) scale(0.5)`;
  }
}
