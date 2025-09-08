import { Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TestRun } from '@qa/test-run/services/test-run';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';

interface IFormGroup {
  environment: FormControl<string | null>,
  variables: FormArray<FormControl<any>>,
  modules: FormControl<'all' | 'selected' | null>,
  moduleIds: FormArray<FormControl<boolean | null>>
}

type CheckBoxItem = {
  _id: string;
  name: string;
  control: FormControl<boolean | null>
};

@Component({
  selector: 'app-start-test-run',
  imports: [
    NzSelectModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    CommonModule,
    FormsModule,
    NzCheckboxModule
  ],
  templateUrl: './start-test-run.html',
  styleUrl: './start-test-run.scss'
})
export class StartTestRun {

  planId = '';
  plan: any = null;
  sortedFeatures: any[] = [];
  searchText = '';

  formGroup = new FormGroup<IFormGroup>({
    environment: new FormControl('', [Validators.required]),
    variables: new FormArray<any>([]),
    modules: new FormControl('all'),
    moduleIds: new FormArray<FormControl<boolean | null>>([])
  });

  constructor(
    private featureService: TestFeature,
    private runService: TestRun,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(param => {
      this.planId = param['id'];
    });
  }

  ngOnInit(): void {
    this.featureService.getPlan(this.planId).subscribe((res) => {
      this.plan = res.data.testPlan;
      console.log(this.plan);
      this.sortedFeatures = [...this.plan.features].sort((a: any, b: any) => a.name.localeCompare(b.name));

      const moduleIds = this.formGroup.get('moduleIds') as IFormGroup['moduleIds'];
      this.sortedFeatures.forEach((f: any) => {
        moduleIds?.push(new FormControl(false));
      });
    });
  }

  getFiltered(): CheckBoxItem[] {
    const moduleIds = this.formGroup.get('moduleIds') as IFormGroup['moduleIds'];
    const filtered: CheckBoxItem[] = [];

    this.sortedFeatures.forEach((f: any, index: number) => {
      if (f.name.toLowerCase().includes(this.searchText.toLowerCase())) {
        filtered.push({
          _id: f._id,
          name: f.name,
          control: moduleIds.controls[index]
        });
      }
    });

    return filtered;
  }

  addVariableField(): void {
    (this.formGroup.get('variables') as FormArray).push(
      new FormGroup({
        key: new FormControl('', [Validators.required]),
        value: new FormControl('', [Validators.required])
      })
    );
  }

  removeVariable(index: number): void {
    (this.formGroup.get('variables') as FormArray).removeAt(index);
  }

  startTest(): void {
    const formValue = {
      ...this.formGroup.value,
      moduleIds: this.formGroup.value.moduleIds?.map((selected: any, index: number) => selected ? this.sortedFeatures[index]._id : false).filter((selected: any) => selected !== false)
    };
    this.runService.startTest(this.planId, formValue.environment!, formValue.variables!, formValue.moduleIds ?? []).subscribe(({ data: { startTestRun } }) => {
      this.router.navigate([`/dashboard/run/${this.planId}/${startTestRun._id}`])
    });
  }
}
