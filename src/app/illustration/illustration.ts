import { Component, computed, effect, input, OnDestroy, signal } from '@angular/core';
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
  private resetFallingTimer?: ReturnType<typeof setTimeout>;

  private readonly hairSlots = 11;
  protected readonly hairOrder = this.createHairOrder(this.hairSlots);
  protected readonly hairXPositions = [58, 65, 72, 79, 86, 93, 100, 107, 114, 121, 128];
  protected readonly hairRotations = [-22, -17, -12, -7, -3, 0, 3, 7, 12, 17, 22];
  protected readonly hairColors = [
    '#ff4d6d',
    '#ff7a00',
    '#ffd60a',
    '#7bdc2f',
    '#00c2a8',
    '#00a6ff',
    '#4c6fff',
    '#7c4dff',
    '#c13fff',
    '#ff4fb3',
    '#ff6b6b',
  ];
  private readonly previousCntBad = signal(0);
  protected readonly recentlyFallenHair = signal<number | null>(null);

  // Make the enum accessible in the template
  protected readonly Scenario = Scenario;

  // Calculates how many "bad parts" should be drawn
  protected cntBad = computed(() => {
    const d = this.dynamic();
    if (!d) return 0;
    return d?.cntBad;
  });

  constructor() {
    effect(() => {
      const bad = this.clampCntBad(this.cntBad());
      const previous = this.previousCntBad();

      if (bad > previous) {
        const justFallenRank = Math.min(bad - 1, this.hairSlots - 1);
        this.recentlyFallenHair.set(this.hairOrder[justFallenRank]);
        this.scheduleFallingReset();
      } else if (bad < previous) {
        this.recentlyFallenHair.set(null);
        this.clearFallingReset();
      }

      this.previousCntBad.set(bad);
    });
  }

  ngOnDestroy(): void {
    this.clearFallingReset();
  }

  protected isHairVisible(slot: number): boolean {
    return this.getHairRank(slot) >= this.clampCntBad(this.cntBad());
  }

  protected isHairOnGround(slot: number): boolean {
    const rank = this.getHairRank(slot);
    const bad = this.clampCntBad(this.cntBad());
    return rank < bad && this.recentlyFallenHair() !== slot;
  }

  protected isHairFalling(slot: number): boolean {
    return this.recentlyFallenHair() === slot;
  }

  protected mouthPath(): string {
    const bad = this.clampCntBad(this.cntBad());
    const curvature = this.faceMood(bad) * 10;
    const controlY = 148 + curvature;
    return `M 78 148 Q 100 ${controlY.toFixed(2)} 122 148`;
  }

  protected eyePath(side: 'left' | 'right'): string {
    const bad = this.clampCntBad(this.cntBad());
    const mood = this.faceMood(bad);

    const centerX = side === 'left' ? 84 : 116;
    const baseY = 118;
    const halfWidth = 7;
    const controlY = baseY - mood * 3.5;

    return `M ${(centerX - halfWidth).toFixed(2)} ${baseY.toFixed(2)} Q ${centerX.toFixed(2)} ${controlY.toFixed(2)} ${(centerX + halfWidth).toFixed(2)} ${baseY.toFixed(2)}`;
  }

  protected hairTransform(slot: number): string {
    return `translate(${this.hairXPositions[slot]} ${this.hairAnchorY(slot)}) rotate(${this.hairRotations[slot]})`;
  }

  protected hairPath(slot: number): string {
    const side = slot < 5 ? -1 : slot > 5 ? 1 : 0;
    const sway = side * (1.2 + (Math.abs(slot - 5) % 3) * 0.35);
    const height = 12 + (slot % 3);
    const lift = 0.45 * height;
    const tipShift = sway * 0.35;

    return `M 0 0 C ${sway.toFixed(2)} ${(-lift).toFixed(2)} ${(sway * 0.7).toFixed(2)} ${(-height * 0.82).toFixed(2)} ${tipShift.toFixed(2)} ${(-height).toFixed(2)}`;
  }

  protected groundHairPath(slot: number): string {
    const width = 7 + (slot % 3);
    const peak = 4 + (slot % 2);
    return `M ${-width} 0 C ${-2} ${-peak} ${2} ${peak} ${width} 0`;
  }

  protected hairColor(slot: number): string {
    return this.hairColors[slot % this.hairColors.length];
  }

  protected fallingHairStyle(slot: number): string {
    const rank = this.getHairRank(slot);
    const spreadTargetX = 24 + (rank * 152) / (this.hairSlots - 1);
    const driftX = spreadTargetX - this.hairXPositions[slot];
    const rotation = (driftX >= 0 ? 1 : -1) * (190 + (rank % 4) * 32);
    const duration = (0.64 + (rank % 5) * 0.08).toFixed(2);
    const fallY = 110 + (rank % 4) * 7;
    return `--fall-x:${driftX.toFixed(1)}px;--fall-y:${fallY}px;--fall-rotate:${rotation}deg;animation-duration:${duration}s;`;
  }

  protected groundHairTransform(slot: number): string {
    const rank = this.getHairRank(slot);
    const x = 45 + rank * 10;
    const y = 200 + (slot % 3) * 3;
    const rotation = -25 + (slot % 6) * 10;
    return `translate(${x} ${y}) rotate(${rotation}) scale(0.88)`;
  }

  private clampCntBad(value: number): number {
    return Math.min(Math.max(value, 0), this.hairSlots);
  }

  private faceMood(bad: number): number {
    if (bad <= 5) {
      return 1 - bad / 5;
    }

    return -((bad - 5) / 6);
  }

  private getHairRank(slot: number): number {
    return this.hairOrder.indexOf(slot);
  }

  private createHairOrder(count: number): number[] {
    const order = Array.from({ length: count }, (_, i) => i);
    let seed = 98731;

    for (let i = order.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      const j = Math.floor((seed / 4294967296) * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    return order;
  }

  private hairAnchorY(slot: number): number {
    const x = this.hairXPositions[slot];
    const radius = 46;
    const dx = x - 100;
    const arcY = 122 - Math.sqrt(Math.max(0, radius * radius - dx * dx));
    return arcY + 1;
  }

  private scheduleFallingReset(): void {
    this.clearFallingReset();
    this.resetFallingTimer = setTimeout(() => {
      this.recentlyFallenHair.set(null);
    }, 900);
  }

  private clearFallingReset(): void {
    if (this.resetFallingTimer) {
      clearTimeout(this.resetFallingTimer);
      this.resetFallingTimer = undefined;
    }
  }

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
