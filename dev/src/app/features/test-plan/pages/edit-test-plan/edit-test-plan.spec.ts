import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestPlan } from './edit-test-plan';

describe('EditTestPlan', () => {
  let component: EditTestPlan;
  let fixture: ComponentFixture<EditTestPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTestPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
