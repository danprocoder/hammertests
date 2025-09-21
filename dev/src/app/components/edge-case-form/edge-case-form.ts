import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzListModule } from "ng-zorro-antd/list";
import { Clipboard } from "../../services/clipboard";

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

  onChange = (value: Pick<IEdgeCase, '_id' | 'title' | 'expectation' | 'order'>[]) => {};
  onTouched = () => {};

  edgeCases: FormArray;

  constructor(private fb: FormBuilder, private clipboard: Clipboard) {
    this.edgeCases = this.fb.array([]);
  }

  writeValue(value: IEdgeCase[]) {
    if (value && Array.isArray(value)) {
      value.forEach((data, i) => {
        this.edgeCases.push(this.fb.group({
          _id: data?._id,
          title: [data.title, Validators.required],
          expectation: [data.expectation, Validators.required],
          order: [data.order ?? i],
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
    let nextOrder = 0;
    const orders = this.edgeCases.controls.map(control => control.value.order);
    if (orders.length) {
      nextOrder = Math.max(...orders) + 1;
    }

    this.edgeCases.push(this.fb.group({
      title: ['', Validators.required],
      expectation: ['', Validators.required],
      order: nextOrder,
      edit: [true]
    }));
  }

  deleteNewEdgeCase(i: number): void {
    this.edgeCases.removeAt(i);
  }

  saveEdgeCase(i: number): void {
    this.edgeCases.at(i).patchValue({ edit: false });
  }

  makeEditable(i: number): void {
    this.edgeCases.controls.forEach(control => control.patchValue({ edit: false }));

    this.edgeCases.at(i).patchValue({ edit: true });
  }

  copyToClipboard(i: number): void {
    const edgeCase = this.edgeCases.at(i).value;
    this.clipboard.copyToClipboard('edge_case', JSON.stringify({
      title: edgeCase.title,
      expectation: edgeCase.expectation
    }));
  }

  pasteFromClipboard(i: number): void {
    this.clipboard.readFromClipboard('edge_case').then(data => {
      if (data) {
        const parsed = JSON.parse(data);
        this.edgeCases.at(i).patchValue({
          title: parsed.title,
          expectation: parsed.expectation
        });
      }
    });
  }

  existsInClipboard(): boolean {
    return this.clipboard.exists('edge_case');
  }
}
