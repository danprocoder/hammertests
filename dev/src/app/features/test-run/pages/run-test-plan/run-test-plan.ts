import { Component } from '@angular/core';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { TestRun } from '@qa/test-run/services/test-run';
import { ActivatedRoute, Router } from '@angular/router';
import { from, switchMap } from 'rxjs';
import { uploadData, getUrl } from '@aws-amplify/storage';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

interface IDisplayTestRunEdgeCase extends IEdgeCase, Required<Pick<ITestRunEdgeCase, 'attachments' | 'stepsToReproduce' | 'comment'>> {
  status: string | null;
}

interface IDisplayTestRunCase {
  feature: {
    id: string;
    name: string;
  },
  id: string;
  name: string;
  description?: string;
  comment: string;
  attachments: string[],
  stepsToTest: IStepToTest[],
  edgeCases: IDisplayTestRunEdgeCase[]
}

@Component({
  selector: 'app-run-test-plan',
  templateUrl: './run-test-plan.html',
  styleUrl: './run-test-plan.scss',
  standalone: false
})
export class RunTestPlan {

  ready = false;
  planId: string = '';
  testRunId: string = '';
  testRun: any;
  title: string = '';
  createdAt: string = '';
  testCases: IDisplayTestRunCase[] = [];
  testCasePosition = 0;

  generalComments: string = '';
  showCommentArea = false;

  showCommentDialog = false;
  overallComment = '';

  currentDisplayedTestCase: any;
  attachedFiles: NzUploadFile[] = [];

  /**
   * Stores the currently selected edge case for modal dialogs.
   * Used to determine which edge case is being modified when displaying or editing edge case-related modals.
   */
  selectedEdgeCase: any;

  edgeCaseCommentModalVisible = false;
  edgeCaseComment: any;
  edgeCaseAttachmentModalVisible = false;
  edgeCaseAttachments: NzUploadFile[] = [];

  stepsToReproduceModalVisible = false;
  stepsForm = new FormGroup<any>({
    steps: new FormArray<any>([])
  });

  statuses = [
    { value: 'passed', name: 'Passed' },
    { value: 'passed-with-warnings', name: 'Passed with Warnings' },
    { value: 'needs-a-retest', name: 'Needs a Retest' },
    { value: 'skipped', name: 'Skipped' },
    { value: 'failed', name: 'Failed' },
  ];

  constructor(
    private featureService: TestFeature,
    private runTestService: TestRun,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.planId = param['id'];
      this.testRunId = param['testRunId'];
    });
  }

  ngOnInit() {
    this.runTestService.getTestRun(this.testRunId).subscribe(({ data: { getTestRun } }) => {
      this.testRun = getTestRun;

      this.featureService.getPlan(this.planId).subscribe(({ data: { testPlan } }) => {
        this.title = testPlan.name;
        this.createdAt = this.testRun.createdAt;

        // TODO: remove this endpoint as it can be fetched with getTestRun data
        this.runTestService.getRunTestCases(this.planId, this.testRunId).subscribe(({ data: { getTestRunCases: ranTestCases } }) => {
          this.testCases = this.getFilteredFeatures(testPlan.features)
            .sort((a: any, b: any) => a.order - b.order)
            .reduce((prev: IDisplayTestRunCase[], curr: ITestFeature) => {
              const mapped = (curr.testCases ?? [])
                .sort((a, b) => a.order - b.order)
                .map((testCase) => {
                  const savedRunTC: ITestRunCase = ranTestCases.find((tc: any) => tc.testCaseId === testCase._id);

                  const mergedEdgeCases: IDisplayTestRunEdgeCase[] = (testCase.edgeCases ?? []).map((edgeCase) => {
                    if (!savedRunTC) {
                      return {
                        ...edgeCase,
                        status: null,
                        comment: '',
                        stepsToReproduce: [],
                        attachments: []
                      };
                    }

                    const savedEdgeCase = savedRunTC.edgeCases.find((savedEC: any) => savedEC.edgeCaseId._id == edgeCase._id);
                    if (!savedEdgeCase) {
                      return {
                        ...edgeCase,
                        status: '',
                        comment: '',
                        stepsToReproduce: [],
                        attachments: []
                      };
                    }
                    
                    return {
                      ...edgeCase,
                      status: savedEdgeCase.status,
                      comment: savedEdgeCase.comment ?? '',
                      attachments: savedEdgeCase.attachments ?? [],
                      stepsToReproduce: savedEdgeCase.stepsToReproduce  ?? []
                    };
                  });

                  return {
                    feature: {
                      id: curr._id,
                      name: curr.name
                    },
                    id: testCase._id,
                    name: testCase.name,
                    description: testCase.description,
                    stepsToTest: testCase.stepsToTest ?? [],
                    edgeCases: mergedEdgeCases,
                    attachments: [],
                    comment: ''
                  } satisfies IDisplayTestRunCase;
                });

              return [...prev, ...mapped];
            }, [] as IDisplayTestRunCase[]);

          const lastUnsavedIndex = this.testCases.findIndex((tc: any) => !tc.edgeCases.every((edgeCase: any) => !!edgeCase.status));
          this.testCasePosition = lastUnsavedIndex >= 0 ? lastUnsavedIndex : 0;
          this.setSelectedTestCase();
          this.ready = true;
        });
      });
    });
  }

  getFilteredFeatures(features: ITestFeature[]): ITestFeature[] {
    if (!this.testRun.modulesToTest.length) {
      return features;
    }
    return features.filter((f) => this.testRun.modulesToTest.includes(f._id));
  }

  getPercentage(): number {
    let totalSaved = 0;
    this.testCases.forEach((tc: any) => {
      if (tc.edgeCases.length && tc.edgeCases.every((edgeCase: any) => !!edgeCase.status)) {
        totalSaved++;
      }
    });

    return (totalSaved / this.testCases.length) * 100;
  }

  setSelectedTestCase(): void {
    this.currentDisplayedTestCase = this.testCases[this.testCasePosition];
  }

  /********************** STEPS TO REPRODUCE **********************/

  showStepsToReproduceModal(edgeCase: IDisplayTestRunEdgeCase): void {
    this.selectedEdgeCase = edgeCase;
    this.stepsToReproduceModalVisible = true;

    const array = this.stepsForm.get('steps') as FormArray;
    edgeCase.stepsToReproduce .forEach((step) => {
      array.push(new FormGroup({
        ...(step._id ? { _id: new FormControl(step._id) } : {}),
        step: new FormControl(step.step)
      }))
    });
  }

  hideStepsToReproduceModal(): void {
    this.stepsToReproduceModalVisible = false;
    (this.stepsForm.get('steps') as FormArray).clear();
  }

  addStepInput(): void {
    (this.stepsForm.get('steps') as FormArray).push(new FormGroup({
      step: new FormControl('', [Validators.required])
    }));
  }

  deleteStepInput(index: number): void {
    (this.stepsForm.get('steps') as FormArray).removeAt(index);
  }

  saveStepsToReproduce(): void {
    this.selectedEdgeCase.stepsToReproduce = [...this.stepsForm.get('steps')?.value];

    this.hideStepsToReproduceModal();
  }

  showEdgeCaseCommentModal(edgeCase: any): void {
    this.selectedEdgeCase = edgeCase;
    this.edgeCaseComment = this.selectedEdgeCase.comment;
    this.edgeCaseCommentModalVisible = true;
  }

  hideEdgeCaseCommentModal(): void {
    this.edgeCaseCommentModalVisible = false;
    this.edgeCaseComment = null;
    this.selectedEdgeCase = null;
  }

  saveEdgeCaseComment(): void {
    this.selectedEdgeCase.comment = this.edgeCaseComment;
    this.hideEdgeCaseCommentModal();
  }

  showEdgeCaseAttachmentModal(edgeCase: any): void {
    this.selectedEdgeCase = edgeCase;
    this.edgeCaseAttachmentModalVisible = true;

    edgeCase.attachments?.forEach((path: any) => {
      getUrl({
        path,
        options: { expiresIn: 3600 }
      }).then((res: any) => {
        const filename = res.url.href.split('/').pop();
        this.edgeCaseAttachments.push({
          uid: filename,
          name: filename,
          url: res.url.href
        })
      });
    });
  }

  hideEdgeCaseAttachmentModal(): void {
    this.selectedEdgeCase.attachments = [...this.edgeCaseAttachments.map(attachment => {
      if (!attachment.url?.startsWith('public/')) {
        const url = new URL(attachment.url!);
        return url.pathname.replace(/^\/public\//, 'public/');
      }
      return attachment.url;
    })];
    this.edgeCaseAttachmentModalVisible = false;
    this.edgeCaseAttachments = [];
    this.selectedEdgeCase = null;
  }

  uploadEdgeCaseAttachments = (req: NzUploadXHRArgs) => {
    const fileName = `${Math.floor(Math.random() * 1000000)}.jpg`;
    const path = `public/plan_${this.planId}/test_run_${this.testRunId}/edgeCase_${this.selectedEdgeCase._id}_${fileName}`;
    const { result } = uploadData({
      path,
      data: req.file as any,
      options: {
        contentType: req.file.type,
        bucket: 'qa-helper',
        onProgress: ({ transferredBytes, totalBytes }: any) => {
          const percent = (transferredBytes / totalBytes) * 100;
          req.onProgress?.({ percent }, req.file);
        }
      }
    });

    return from(result)
      .subscribe((res: any) => {
        this.edgeCaseAttachments.push({ uid: fileName, name: fileName, url: res.path });
        req.onSuccess?.({ key: res.path }, req.file, res);
      }, (err: any) => req.onError?.(err, req.file));
  }

  getStatusNameByValue(value: any): string {
    const status =  this.statuses.find((status: any) => status.value === value);
    return status?.name!;
  }

  onPrevClick(): void {
    if (this.testCasePosition == 0) return;

    this.testCasePosition--;
    this.showCommentArea = false;
    this.setSelectedTestCase();
  }

  onNextClick(): void {
    if (this.testCasePosition == this.testCases.length - 1) return;

    this.saveTestCaseResult().subscribe(() => {
      this.testCasePosition++;
      this.showCommentArea = false;
      this.setSelectedTestCase();
    });
  }

  canGoPrev(): boolean {
    return this.testCasePosition > 0;
  }

  canGoNext(): boolean {
    if (this.testCasePosition >= (this.testCases.length - 1)) {
      return false;
    }

    return this.currentDisplayedTestCase.edgeCases.every((edgeCase: any) => !!edgeCase.status);
  }

  uploadAttachments = (req: any): any => {
    const { result } = uploadData({
      path: `public/plan_${this.planId}/test_run_${this.testRunId}/${Math.floor(Math.random() * 1000000)}.jpg`,
      data: req.file,
      options: {
        contentType: req.file.type,
        bucket: 'qa-helper',
        onProgress: ({ transferredBytes, totalBytes }: any) => {
          const percent = (transferredBytes / totalBytes) * 100;
          req.onProgress({ percent }, req.file);
        }
      }
    });

    result
      .then(res => {
        this.testCases[this.testCasePosition].attachments?.push(res.path);
        req.onSuccess({ key: res.path }, req.file, res);
      })
      .catch(err => req.onError(err, req.file));

    return result
  }

  canSubmit(): boolean {
    let totalSaved = 0;
    this.testCases.forEach((tc: any) => {
      if (tc.status) {
        totalSaved++;
      }
    });

    return this.testCases.length - totalSaved <= 0
  }

  onSubmit(): void {
    this.saveTestCaseResult().pipe(
      switchMap(() => this.runTestService.finish(this.planId, this.testRunId))
    ).subscribe(() => {
      this.router.navigate(['/dashboard/run/result/' + this.testRunId]);
    });
  }

  getPayload(): ITestRunCase {
    return {
      testCaseId: this.currentDisplayedTestCase.id,
      edgeCases: this.currentDisplayedTestCase.edgeCases.map((edgeCase: any) => {
        const payload: ITestRunEdgeCase = {
          edgeCaseId: edgeCase._id,
          status: edgeCase.status,
          attachments: edgeCase.attachments ?? [],
          stepsToReproduce: (edgeCase.stepsToReproduce ?? []).map((step: any) => ({
            ...(step._id ? { _id: step._id } : {}),
            step: step.step
          }))
        };
        if (edgeCase.comment) {
          payload.comment = edgeCase.comment;
        }

        return payload;
      }),
    };
  }

  saveTestCaseResult(): Observable<any> {
    console.log(this.getPayload());
    return this.runTestService.save(this.planId, this.testRunId, this.getPayload());
  }
}
