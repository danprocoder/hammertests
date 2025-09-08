import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTestPlan } from './view-test-plan';

describe('ViewTestPlan', () => {
  let component: ViewTestPlan;
  let fixture: ComponentFixture<ViewTestPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTestPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTestPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
