import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStatus } from './test-status';

describe('TestStatus', () => {
  let component: TestStatus;
  let fixture: ComponentFixture<TestStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
