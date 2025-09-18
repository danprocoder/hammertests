import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { IIssue } from '../../models/test-run.model';
import { StepsForm } from '@qa/components/steps-form/steps-form';

@Component({
  selector: 'app-create-edge-case-issue-modal',
  imports: [
    StepsForm,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzUploadModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-edge-case-issue-modal.html',
  styleUrl: './create-edge-case-issue-modal.scss'
})
export class CreateEdgeCaseIssueModal {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() issueUpdated = new EventEmitter<any>();

  @Input() edgeCase: any = null;

  issueForm: FormGroup;
  attachments: any[] = [];

  constructor(private fb: FormBuilder) {
    this.issueForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      stepsToReproduce: [],
    });
  }

  ngOnChanges(): void {
    this.issueForm.reset();
    // this.steps.clear(); // TODO: Move this

    if (this.edgeCase && this.edgeCase.issue) {
      this.setupForm(this.edgeCase.issue);
    }
  }

  setupForm(issue: IIssue): void {
    this.issueForm.patchValue({
      title: issue.title,
      description: issue.description,
      stepsToReproduce: issue.stepsToReproduce
    });
  }

  createIssue(): void {
    const value = this.issueForm.value;
    this.issueUpdated.emit({
      ...value,
      // _id is needed if editing an existing issue
      ...(this.edgeCase.issue ? { _id: this.edgeCase.issue._id } : {}),
      stepsToReproduce: value.stepsToReproduce.map((s: any) => {
        return { step: s.step };
      })
    });
    this.onClose();
  }

  onClose(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
