import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CommonModule } from '@angular/common';
import _cloneDeep from 'lodash.clonedeep';
import { Deactivatable } from '../../../../guards/can-deactivate.guard';
import { StepsForm } from '@qa/components/steps-form/steps-form';
import { EdgeCaseForm } from '@qa/components/edge-case-form/edge-case-form';
import { NzCardModule } from 'ng-zorro-antd/card';

interface ITestEnvironment {
  _id?: string;
  name: string;
  url: string;
}

interface IPlan {
  _id: string;
  name: string;
  description: string;
  environments: ITestEnvironment[];
  features: ITestFeature[];
}

interface ITestFeature {
  _id: string;
  name: string;
  url: string;
  order: number;
  testCases: ITestCase[]
}

interface StepToTest {
  _id: string;
  description: string;
}

interface ITestCase {
  _id: string;
  name: string;
  description: string;
  order: number;
  stepsToTest: StepToTest[],
  edgeCases: IEdgeCase[]
}

interface IEdgeCase {
  _id: string;
  title: string;
  expectation: string;
  order: number;
}

interface ITestPlanFormEnvironments {
  _id: FormControl<string | null | undefined>,
  name: FormControl<string | null>,
  url: FormControl<string | null>
}

interface ITestPlanForm {
  name: FormControl<string | null | undefined>,
  description: FormControl<string | null | undefined>,
  environments: FormArray<any>,
  features: FormArray<any>
}

@Component({
  selector: 'app-edit-test-plan',
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    NzCollapseModule,
    NzIconModule,
    NzListModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzDividerModule,
    ReactiveFormsModule,
    StepsForm,
    EdgeCaseForm
],
  templateUrl: './edit-test-plan.html',
  styleUrl: './edit-test-plan.scss'
})
export class EditTestPlan implements Deactivatable<EditTestPlan> {
  planId: string = '';
  features: ITestFeature[] = [];

  formGroup = new FormGroup<ITestPlanForm>({
    name: new FormControl(''),
    description: new FormControl(''),
    environments: new FormArray<any>([]),
    features: new FormArray<any>([])
  });
  deletedFeatures: any[] = [];
  deletedTestCases: any[] = [];

  searchText = '';

  ready = false;
  readyError = false;
  plan?: IPlan;

  saved = false;

  @ViewChild('stepInput', { static: false }) stepInput?: ElementRef<HTMLInputElement>;

  constructor(
    private featureService: TestFeature,
    private route: ActivatedRoute,
    private router: Router, 
    private message: NzMessageService
  ) {
    this.route.params.subscribe(param => {
      this.planId = param['id'];
    });
  }

  ngOnInit() {
    if (this.planId) {
      this.featureService.getPlan(this.planId).subscribe(({ data: { testPlan } }) => {
        this.plan = testPlan;
        this.setUpForm(testPlan);
        this.ready = true;
      }, () => {
        this.ready = false;
        this.readyError = true;
      });
    } else {
      this.ready = true;
    }
  }

  setUpForm(plan: IPlan): void {
    this.formGroup.get('name')?.setValue(plan.name);
    this.formGroup.get('description')?.setValue(plan.description);

    // Populate environments
    const environments = this.formGroup.get('environments') as ITestPlanForm['environments'];
    plan.environments?.forEach((env) => {
      environments.push(new FormGroup<ITestPlanFormEnvironments>({
        _id: new FormControl(env._id),
        name: new FormControl(env.name, [Validators.required]),
        url: new FormControl(env.url)
      }));
    });

    // Populate features
    plan.features.forEach((f: ITestFeature, fIndex: number) => {
      (this.formGroup.get('features') as FormArray).push(new FormGroup<any>({
        _id: new FormControl(f._id),
        name: new FormControl(f.name, [Validators.required]),
        url: new FormControl(f.url),
        order: new FormControl(f.order ?? fIndex),

        // Populate test cases
        testCases: new FormArray<any>(
          (f.testCases ?? []).map((t: ITestCase, index: number) => new FormGroup<any>({
            _id: new FormControl(t._id),
            featureId: new FormControl(f._id),
            name: new FormControl(t.name, [Validators.required]),
            description: new FormControl(t.description),
            order: new FormControl(t.order ?? index),

            // Steps to test
            stepsToTest: new FormControl((t.stepsToTest ?? []).map((item: any) => ({
              _id: item._id,
              step: item.description
            }))),

            // Populate edge cases
            edgeCases: new FormControl((t.edgeCases ?? []).map((item: IEdgeCase, i: number) => ({
              _id: item._id,
              title: item.title,
              expectation: item.expectation,
              order: item.order ?? i
            })))
          }))
        )
      }))
    });
  }

  addEnvironment(): void {
    const environments = this.formGroup.get('environments') as ITestPlanForm['environments'];
    environments.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      url: new FormControl('')
    }));
  }

  addToFeatures(): void {
    const featuresArr = this.formGroup.get('features') as FormArray;
    featuresArr.push(new FormGroup<any>({
      name: new FormControl('', [Validators.required]),
      url: new FormControl(''),
      testCases: new FormArray<any>([]),
      order: new FormControl(featuresArr.length)
    }))
  }

  deleteFeatureAt(features: FormArray<any>, index: number): void {
    const feature = features.controls[index].value;
    if (feature._id) {
      this.deletedFeatures.push(feature._id);
      feature.testCases.forEach((testCase: any) => {console.log(testCase);
        if (testCase._id) {
          this.deletedTestCases.push(testCase._id);
        }
      });
    }
    features.removeAt(index);
  }

  getSortedFeatures(): AbstractControl<any, any>[] {
    const features: FormArray = this.formGroup.get('features') as FormArray;
    return features.controls
      .filter(control =>
        control.value.name
        && control.value.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase())
      )
      .sort((a: any, b: any) => {
        return a.controls['order'].value - b.controls['order'].value;
      });
  }

  addTestCase(testCases: FormArray): void {
    testCases.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      stepsToTest: new FormControl([]),
      edgeCases: new FormControl([]),
      order: new FormControl(testCases.controls.length)
    }));
  }

  deleteTestCaseAt(feature: AbstractControl<any, any>, index: number): void {
    const testCases = feature.get('testCases') as FormArray;
    const testCase = testCases.controls[index].value;
    if (testCase._id) {
      this.deletedTestCases.push(testCase._id);
    }
    testCases.removeAt(index);
  }


  moveFeatureUp(currentIndex: number): void {
    const features = this.formGroup.get('features') as FormArray;

    const contentBefore = (features.controls[currentIndex - 1] as FormGroup).controls['order'];
    const selected = (features.controls[currentIndex] as FormGroup).controls['order'];

    contentBefore.setValue(contentBefore.value + 1);
    selected.setValue(contentBefore.value - 1);
  }

  moveFeatureDown(currentIndex: number): void {
    const features = this.formGroup.get('features') as FormArray;

    const selected = (features.controls[currentIndex] as FormGroup).controls['order'];
    const contentAfter = (features.controls[currentIndex + 1] as FormGroup).controls['order'];

    selected.setValue(selected.value + 1);
    contentAfter.setValue(selected.value - 1);
  }

  getSortedTestCases(feature: AbstractControl<any, any>): any[] {
    const testCases = feature.get('testCases') as FormArray;
    return testCases.controls.sort((a: any, b: any) => {
      return a.controls['order'].value - b.controls['order'].value;
    });
  }

  moveDown(feature: AbstractControl<any, any>, index: number): void {
    const testCases = feature.get('testCases') as FormArray;
    const current = (testCases.controls[index] as FormGroup).controls['order'];
    if (current.value + 1 >= testCases.length) {
      return;
    }

    const below = (testCases.controls[index + 1] as FormGroup).controls['order'];
    current.setValue(current.value + 1);
    below.setValue(below.value - 1);
  }

  moveUp(feature: AbstractControl<any, any>, index: number): void {
    const testCases = feature.get('testCases') as FormArray;
    const current = (testCases.controls[index] as FormGroup).controls['order'];
    if (current.value - 1 < 0) {
      return;
    }

    const above = (testCases.controls[index - 1] as FormGroup).controls['order'];
    current.setValue(current.value - 1);
    above.setValue(above.value + 1);
  }

  getPayload(): { [field: string]: any } {
    const value = _cloneDeep(this.formGroup.value);

    value.features.forEach((feature: any) => {
      feature.testCases.forEach((testCase: any) => {
        testCase.stepsToTest = (testCase.stepsToTest ?? []).map(({ _id, step }: any) => {
          return _id ? { _id, description: step } : { description: step };
        })
      });
    });

    return value;
  }

  save(): void {
    if (this.planId) {
      const { name, description, environments, features } = this.getPayload();
      this.featureService.save(this.planId, name!, description!, environments!, features, this.deletedFeatures, this.deletedTestCases).subscribe(() => {
        this.message.success('Changes saved');

        this.saved = true;
        this.router.navigate(['/dashboard/view/' + this.planId]);
      });
    } else {
      this.featureService.createFeature(this.getPayload()).subscribe(({ data: { createTestPlan } }) => {
        this.message.success('Test plan created');

        this.saved = true;
        this.router.navigate(['/dashboard/view/' + createTestPlan._id]);
      });
    }
  }

  canDeactivate(): boolean {
    if (this.saved) {
      return true;
    }
    return confirm('Your changes will be lost. Are you sure you want to close this page?');
  }
}
