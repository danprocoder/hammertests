import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEdgeCaseIssueModal } from './create-edge-case-issue-modal';

describe('CreateEdgeCaseIssueModal', () => {
  let component: CreateEdgeCaseIssueModal;
  let fixture: ComponentFixture<CreateEdgeCaseIssueModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEdgeCaseIssueModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEdgeCaseIssueModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
