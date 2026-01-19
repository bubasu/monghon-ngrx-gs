import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-wheel-picker',
  imports: [],
  templateUrl: './wheel-picker.component.html',
  styleUrl: './wheel-picker.component.css',
})
export class WheelPickerComponent {
  picks = input<string[]>([]);

  // protected readonly alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Das aktuelle Signal für den gewählten Buchstaben (ersetzt oder ergänzt dein bisheriges guessedLetter)
  protected selectedLetter = signal('A');

  // Methode, die aufgerufen wird, wenn der Picker gescrollt wird
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollLeft = element.scrollLeft;
    const itemWidth = element.offsetWidth / 5; // Weil wir 5 Items gleichzeitig anzeigen
    const index = Math.round(scrollLeft / itemWidth);
    const letter = this.picks()[index];
    if (letter && letter !== this.selectedLetter()) {
      this.selectedLetter.set(letter);
    }
  }
}
