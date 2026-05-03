import { AfterViewInit, Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wheel-picker',
  imports: [],
  templateUrl: './wheel-picker.component.html',
  styleUrl: './wheel-picker.component.css',
})
export class WheelPickerComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  options = input<string[]>([]);
  circular = input(false);
  protected pick = signal('');
  optionPicked = output<string>();

  private readonly itemWidth = 40;
  protected readonly cloneCount = 10;

  protected displayOptions(): string[] {
    const opts = this.options();
    if (!this.circular() || opts.length === 0) {
      return opts;
    }

    const n = opts.length;
    const c = Math.min(this.cloneCount, n);
    return [...opts.slice(n - c), ...opts, ...opts.slice(0, c)];
  }

  ngAfterViewInit() {
    queueMicrotask(() => {
      if (!this.circular()) {
        return;
      }

      const opts = this.options();
      if (opts.length === 0) {
        return;
      }

      const startIndex = Math.min(this.cloneCount, opts.length);
      this.scrollContainer.nativeElement.scrollLeft = startIndex * this.itemWidth;
    });
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const opts = this.options();
    if (opts.length === 0) {
      return;
    }

    let index = Math.round(element.scrollLeft / this.itemWidth);

    if (this.circular()) {
      const n = opts.length;
      const c = Math.min(this.cloneCount, n);
      const min = c;
      const max = c + n - 1;

      if (index < min) {
        index += n;
        element.scrollLeft = index * this.itemWidth;
      } else if (index > max) {
        index -= n;
        element.scrollLeft = index * this.itemWidth;
      }

      const realIndex = ((index - c) % n + n) % n;
      const picked = opts[realIndex];

      if (picked && picked !== this.pick()) {
        this.pick.set(picked);
        this.optionPicked.emit(picked);
      }
      return;
    }

    const picked = opts[index];
    if (picked && picked !== this.pick()) {
      this.pick.set(picked);
      this.optionPicked.emit(picked);
    }
  }

  protected onItemClick(index: number) {
    if (!this.circular()) {
      this.scrollToOption(index);
      return;
    }

    const n = this.options().length;
    if (n === 0) {
      return;
    }

    const c = Math.min(this.cloneCount, n);
    const realIndex = ((index - c) % n + n) % n;
    this.scrollToOption(realIndex);
  }

  scrollToOption(index: number) {
    const container = this.scrollContainer.nativeElement;

    const left = this.circular()
      ? (index + Math.min(this.cloneCount, this.options().length)) * this.itemWidth
      : index * this.itemWidth;

    container.scrollTo({
      left,
      behavior: 'smooth',
    });
  }
}
