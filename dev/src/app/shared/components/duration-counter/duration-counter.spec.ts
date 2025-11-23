import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationCounter } from './duration-counter';

describe('DurationCounter', () => {
  let component: DurationCounter;
  let fixture: ComponentFixture<DurationCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DurationCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
