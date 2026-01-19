import { Component, input, output, signal, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-wheel-picker',
  imports: [],
  templateUrl: './wheel-picker.component.html',
  styleUrl: './wheel-picker.component.css',
})
export class WheelPickerComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  options = input<string[]>([]);
  protected pick = signal('');
  optionPicked = output<string>();

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollLeft = element.scrollLeft;
    const itemWidth = 48; // Die Breite von w-12
    const index = Math.round(scrollLeft / itemWidth);
    const picked = this.options()[index];
    if (picked && picked !== this.pick()) {
      this.pick.set(picked);
      this.optionPicked.emit(picked);
    }
  }

  scrollToOption(index: number) {
    const itemWidth = 48; // Gleicher Wert wie in onScroll
    const container = this.scrollContainer.nativeElement;

    // Scrolle das Element sanft in die Mitte
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  }
}
