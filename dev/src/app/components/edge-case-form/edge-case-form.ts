import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzListModule } from "ng-zorro-antd/list";

interface IEdgeCaseFormValue extends IEdgeCase {
  edit: boolean;
}

@Component({
  selector: 'app-edge-case-form',
  styleUrl: './edge-case-form.scss',
  templateUrl: './edge-case-form.html',
  imports: [
    ReactiveFormsModule,
    NzDividerModule,
    NzListModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EdgeCaseForm),
      multi: true
    }
  ]
})
export class EdgeCaseForm implements ControlValueAccessor {

  onChange = (value: IEdgeCase[]) => {};
  onTouched = () => {};

  edgeCases: FormArray;

  constructor(private fb: FormBuilder) {
    this.edgeCases = this.fb.array([]);
  }

  writeValue(value: IEdgeCase[]) {
    if (value && Array.isArray(value)) {
      value.forEach((data) => {
        this.edgeCases.push(this.fb.group({
          _id: data?._id,
          title: [data.title, Validators.required],
          expectation: [data.expectation, Validators.required],
          order: [data.order],
          edit: [false]
        }));
      });
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
    
    this.edgeCases.valueChanges.subscribe((value: IEdgeCaseFormValue[]) =>
      this.onChange(
        value.map((item) => ({
          ...(item._id ? { _id: item._id }: {}),
          title: item.title,
          expectation: item.expectation,
          order: item.order
        }))
      )
    );
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addNewEdgeCaseInput(): void {
    const maxOrder = Math.max(...this.edgeCases.controls.map(control => control.value.order)) ?? 0;

    this.edgeCases.push(this.fb.group({
      title: ['', Validators.required],
      expectation: ['', Validators.required],
      order: maxOrder + 1,
      edit: [true]
    }));
  }

  deleteNewEdgeCase(i: number): void {
    this.edgeCases.removeAt(i);
  }

  onFieldBlur(i: number): void {
    this.edgeCases.at(i).patchValue({ edit: false });
  }

  makeEditable(i: number): void {
    this.edgeCases.controls.forEach(control => control.patchValue({ edit: false }));

    this.edgeCases.at(i).patchValue({ edit: true });
  }
}
