import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlans } from './test-plans';

describe('TestPlans', () => {
  let component: TestPlans;
  let fixture: ComponentFixture<TestPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPlans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
