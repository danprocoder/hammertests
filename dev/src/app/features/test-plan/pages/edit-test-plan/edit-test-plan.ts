import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    NzCollapseModule,
    NzIconModule,
    NzListModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzListModule,
    NzPopconfirmModule,
    NzDividerModule,
    ReactiveFormsModule
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

  testDataModalVisible = false;
  testDataMode: 'new' | 'edit' = 'new';
  selectedTestCase: FormArray | null = null;
  testDataForm: FormGroup | any = null;
  testDataIndex: number | undefined;

  edgeCaseModalVisible = false;
  edgeCaseForm: FormArray | any = null;

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
            stepsToTest: new FormArray((t.stepsToTest ?? []).map((item: any, i: number) => new FormGroup({
              _id: new FormControl(item._id),
              oldDescription: new FormControl(''),
              description: new FormControl(item.description, [Validators.required]),
              edit: new FormControl(false)
            }))),

            // Populate edge cases
            edgeCases: new FormArray((t.edgeCases ?? []).map((item: IEdgeCase, i: number) => new FormGroup({
              _id: new FormControl(item._id),
              title: new FormControl(item.title, [Validators.required]),
              expectation: new FormControl(item.expectation, [Validators.required]),
              order: new FormControl(item.order ?? i)
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

  getSortedFeatures(features: any): any[] {
    return features.controls.sort((a: any, b: any) => {
      return a.controls['order'].value - b.controls['order'].value;
    });
  }

  /*************** TEST CASES **************/

  addTestCase(testCases: FormArray): void {
    testCases.push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      stepsToTest: new FormArray([]),
      edgeCases: new FormArray([]),
      order: new FormControl(testCases.controls.length)
    }));
  }

  deleteTestCaseAt(testCases: FormArray<any>, index: number): void {
    const tc = testCases.controls[index].value;
    if (tc._id) {
      this.deletedTestCases.push(tc._id);
    }
    testCases.removeAt(index);
  }

  /**************** STEPS TO TEST **************/

  addStepToTest(testCase: FormControl<any>): void {
    const steps = testCase.get('stepsToTest') as FormArray;
    steps.controls.forEach((step) => step.get('edit')?.setValue(false));

    steps.push(
      new FormGroup({
        oldDescription: new FormControl(''),
        description: new FormControl('', [Validators.required]),
        edit: new FormControl(true)
      })
    );

    setTimeout(() => {
      this.stepInput?.nativeElement.focus();
    }, 150);
  }

  editSteptoTest(testCase: FormControl<any>, index: number): void {
    const steps = testCase.get('stepsToTest') as FormArray;
    steps.controls.forEach((step, i) => {
      if (step.get('edit')?.value) {
        this.cancelEditStep(testCase, i);
      }
    });

    const control = steps.at(index);
    const old = control.get('oldDescription') as FormControl;

    old.setValue(control.get('description')?.value);
    control.get('edit')?.setValue(true);

    setTimeout(() => {
      this.stepInput?.nativeElement.focus();
    }, 150);
  }

  onEditStepBlur(testCase: FormControl<any>, index: number): void {
    const step = (testCase.get('stepsToTest') as FormArray).at(index);
    const oldDescription = step.get('oldDescription')?.value;
    const description = step.get('description')?.value;
    // If they are both empty or nothing was changed
    if ((!description && !oldDescription) || (description == oldDescription)) {
      this.cancelEditStep(testCase, index);
    }
  }

  cancelEditStep(testCase: FormControl<any>, index: number): void {
    const control = (testCase.get('stepsToTest') as FormArray).at(index);
    const old = control.get('oldDescription') as FormControl;

    control.get('description')?.setValue(old.value);
    control.get('edit')?.setValue(false);

    if (!control.get('description')?.value) {
      this.removeStepToTest(testCase, index);
    }
  }

  saveEditStep(testCase: FormControl<any>, index: number): void {
    const step = testCase.get('stepsToTest') as FormArray;

    const control = step.at(index);
    control.get('oldDescription')?.setValue('');
    control.get('edit')?.setValue(false);

    if ((step.controls.length - 1) == index) {
      this.addStepToTest(testCase);
    }
  }

  removeStepToTest(testCase: any, index: number): void {
    (testCase.get('stepsToTest') as FormArray).removeAt(index);
  }

  anyStepOnEditMode(testCase: any): boolean {
    const steps = (testCase.get('stepsToTest') as FormArray).controls;

    return steps.some((step) => step.get('edit')?.value);
  }

  onStepKeyDown(ev: KeyboardEvent, testCase: any, index: number): void {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
      this.saveEditStep(testCase, index);
    }
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

  getSortedTestCases(testCases: FormArray<any>): any[] {
    return testCases.controls.sort((a: any, b: any) => {
      return a.controls['order'].value - b.controls['order'].value;
    });
  }

  moveDown(testCases: FormArray<any>, index: number): void {
    const current = (testCases.controls[index] as FormGroup).controls['order'];
    if (current.value + 1 >= testCases.length) {
      return;
    }

    const below = (testCases.controls[index + 1] as FormGroup).controls['order'];
    current.setValue(current.value + 1);
    below.setValue(below.value - 1);
  }

  moveUp(testCases: FormArray<any>, index: number): void {
    const current = (testCases.controls[index] as FormGroup).controls['order'];
    if (current.value - 1 < 0) {
      return;
    }

    const above = (testCases.controls[index - 1] as FormGroup).controls['order'];
    current.setValue(current.value - 1);
    above.setValue(above.value + 1);
  }

  /*
   * EDGE CASE MODAL FUNCTIONS 
   */
  showEdgeCaseModal(testCase: any): void {
    this.selectedTestCase = testCase;
    this.edgeCaseModalVisible = true;
    this.edgeCaseForm = new FormArray([]);
    testCase.get('edgeCases').value.forEach((edgeCase: any) => {
      this.addEdgeCaseInput(edgeCase);
    });
  }

  addEdgeCaseInput(data?: IEdgeCase): void {
    this.edgeCaseForm.push(new FormGroup({
      _id: new FormControl(data?._id),
      title: new FormControl(data?.title, [Validators.required]),
      expectation: new FormControl(data?.expectation, [Validators.required]),
      order: new FormControl(data?.order ?? this.edgeCaseForm.controls.length),
      testData: new FormArray([])
    }));
  }

  closeEdgeCaseModal(): void {
    this.edgeCaseModalVisible = false;
    this.selectedTestCase = null;
    this.edgeCaseForm = null;
  }

  saveEdgeCases(): void {
    const edgeCases = this.selectedTestCase?.get('edgeCases') as FormArray;
    edgeCases.clear();
    this.edgeCaseForm.value.forEach((edgeCase: IEdgeCase, i: number) => {
      edgeCases.push(new FormGroup({
        _id: new FormControl(edgeCase._id),
        title: new FormControl(edgeCase.title),
        expectation: new FormControl(edgeCase.expectation),
        order: new FormControl(edgeCase.order)
      }));
    });
    this.closeEdgeCaseModal();
  }

  getPayload(): { [field: string]: any } {
    const value = _cloneDeep(this.formGroup.value);

    value.features.forEach((feature: any) => {
      feature.testCases.forEach((testCase: any) => {
        testCase.stepsToTest = (testCase.stepsToTest ?? []).map(({ _id, description }: any) => {
          return _id ? { _id, description } : { description };
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
