import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunTestPlan } from './run-test-plan';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RunTestPlan', () => {
  let component: RunTestPlan;
  let fixture: ComponentFixture<RunTestPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RunTestPlan],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunTestPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
