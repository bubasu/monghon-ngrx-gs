import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Illustration } from './illustration';

describe('Illustration', () => {
  let component: Illustration;
  let fixture: ComponentFixture<Illustration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Illustration],
    }).compileComponents();

    fixture = TestBed.createComponent(Illustration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
