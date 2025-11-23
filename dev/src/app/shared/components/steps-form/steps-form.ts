import { Component, ElementRef, forwardRef, ViewChild } from "@angular/core";
import { Validators, FormArray, FormBuilder, ReactiveFormsModule, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";

interface IStepValue {
  step: string;
}

interface IStepFormValue extends IStepValue {
  edit: boolean;
}

@Component({
  selector: 'app-steps-form',
  templateUrl: './steps-form.html',
  styleUrl: './steps-form.scss',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzPopconfirmModule,
    NzButtonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StepsForm),
      multi: true
    }
  ]
})
export class StepsForm implements ControlValueAccessor {
  stepsForm: FormGroup;

  @ViewChild('stepInput', { static: false }) stepInput?: ElementRef<HTMLTextAreaElement>;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private fb: FormBuilder) {
    this.stepsForm = this.fb.group({
      steps: this.fb.array([])
    });
  }

  writeValue(steps: IStepValue[]): void {
    this.steps.clear();

    if (steps && Array.isArray(steps)) {
      steps.forEach((item) => {
        this.steps.push(this.fb.group({
          step: this.fb.control(item.step, Validators.required),
          edit: this.fb.control(false)
        }));
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;

    this.steps.valueChanges.subscribe((value: IStepFormValue) => fn(value));
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addStep(): void {
    this.steps.push(this.fb.group({
      step: this.fb.control('', Validators.required),
      edit: this.fb.control(true)
    }));

    this.focusInput();
  }

  onStepBlur(index: number): void {
    const step = this.steps.at(index);

    if (!step.value.step) {
      this.steps.removeAt(index);
    } else {
      step.patchValue({ edit: false });
    }
  }

  editStep(index: number): void {
    this.steps.at(index).patchValue({ edit: true });
    
    this.focusInput();
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

  private focusInput(): void {
    setTimeout(() => {
      this.stepInput?.nativeElement.focus();
    }, 50);
  }

  get steps(): FormArray {
    return this.stepsForm.get('steps') as FormArray;
  }
}
