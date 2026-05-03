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
    const itemWidth = 40; // The width of w-10
    const index = Math.round(scrollLeft / itemWidth);
    const picked = this.options()[index];
    if (picked && picked !== this.pick()) {
      this.pick.set(picked);
      this.optionPicked.emit(picked);
    }
  }

  scrollToOption(index: number) {
    const itemWidth = 40; // Same value as in onScroll
    const container = this.scrollContainer.nativeElement;

    // Smoothly scroll the element to the center
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  }
}
