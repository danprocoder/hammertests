import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseDescription } from './test-case-description';

describe('TestCaseDescription', () => {
  let component: TestCaseDescription;
  let fixture: ComponentFixture<TestCaseDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCaseDescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseDescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
