import { Component, computed, input } from '@angular/core';
import { Dynamic, Scenario } from '../model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-illustration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './illustration.html',
  styleUrl: './illustration.css',
})
export class Illustration {
  scenario = input<Scenario>();
  dynamic = input<Dynamic>();

  // Make the enum accessible in the template
  protected readonly Scenario = Scenario;

  // Calculates how many "bad parts" should be drawn
  protected cntBad = computed(() => {
    const d = this.dynamic();
    if (!d) return 0;
    return d?.cntBad;
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
