import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelPickerComponent } from './wheel-picker.component';

describe('WheelPicker', () => {
  let component: WheelPickerComponent;
  let fixture: ComponentFixture<WheelPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WheelPickerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
