import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunTestHistory } from './run-test-history';

describe('RunTestHistory', () => {
  let component: RunTestHistory;
  let fixture: ComponentFixture<RunTestHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunTestHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunTestHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
