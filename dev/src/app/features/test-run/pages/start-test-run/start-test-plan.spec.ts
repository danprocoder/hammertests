import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartTestRun } from './start-test-run';

describe('StartTestRun', () => {
  let component: StartTestRun;
  let fixture: ComponentFixture<StartTestRun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartTestRun]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartTestRun);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
