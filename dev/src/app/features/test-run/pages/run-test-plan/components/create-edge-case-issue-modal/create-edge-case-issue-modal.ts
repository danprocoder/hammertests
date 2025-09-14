import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-create-edge-case-issue-modal',
  imports: [
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

  @ViewChild('stepInput', { static: false }) stepInput?: ElementRef<HTMLTextAreaElement>;

  issueForm: FormGroup;
  attachments: any[] = [];

  constructor(private fb: FormBuilder) {
    this.issueForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      stepsToReproduce: this.fb.array([]),
    });
  }

  ngOnChanges(): void {
    if (this.edgeCase) {
      console.log(this.edgeCase);
    }
  }

  addStep(): void {
    this.steps.push(this.fb.group({
      step: this.fb.control('', Validators.required),
      edit: this.fb.control(true)
    }));

    setTimeout(() => {
      this.stepInput?.nativeElement.focus();
    }, 50);
  }

  onStepBlur(index: number): void {
    const step = this.steps.at(index);
    step.get('edit')?.setValue(false);
  }

  editStep(index: number): void {
    const step = this.steps.at(index);
    step.get('edit')?.setValue(true);
  }

  removeStep(index: number): void {
    this.steps.removeAt(index);
  }

  onSaveStep(index: number): void {
    this.onStepBlur(index);
    
    if (index == this.steps.length - 1) {
      this.addStep();
    }
  }

  onStepsKeyDown(ev: KeyboardEvent, index: number): void {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
      this.onSaveStep(index);
    }
  }

  get steps(): FormArray {
    return this.issueForm.get('stepsToReproduce') as FormArray;
  }

  createIssue(): void {
    const value = this.issueForm.value;
    this.issueUpdated.emit({
      ...value,
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
