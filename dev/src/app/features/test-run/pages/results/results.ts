import { Component } from '@angular/core';
import { TestRun } from '@qa/test-run/services/test-run';
import { ActivatedRoute } from '@angular/router';
import { getUrl } from '@aws-amplify/storage';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-results',
  templateUrl: './results.html',
  styleUrl: './results.scss',
  standalone: false
})
export class Results {
  resultId = '';

  result: any;
  testResults: any[] = [];
  tableTestResults: any[] = [];
  filterStatus = 'all';

  total = 0;
  totalRun = 0;
  passed = 0;
  failed = 0;
  skipped = 0;

  selectedTestCase: any = null;
  selectedComment: any = null;

  constructor(private resultsService: TestRun, private route: ActivatedRoute, private testFeature: TestFeature, private nzImageService: NzImageService) {
    this.route.params.subscribe(param => {
      this.resultId = param['id'];
    });
  }

  ngOnInit(): void {
    this.resultsService.getResult(this.resultId).subscribe(({ data: { getTestRun } }) => {
      this.result = getTestRun;
      this.testResults = getTestRun.testCases;
      this.tableTestResults = [...new Set(getTestRun.testCases)];

      this.total = getTestRun.result.total;
      this.totalRun = getTestRun.result.totalRun;
      this.passed = getTestRun.result.totalPassed;
      this.failed = getTestRun.result.totalFailed;
      this.skipped = this.total - this.totalRun;
    });
  }

  percentagePassed(): number {
    return Math.round((this.passed / this.total) * 100);
  }

  percentageFailed(): number {
    return Math.round((this.failed / this.total) * 100);
  }

  passedEdgeCases(result: any): number {
    return result.edgeCases.filter((ec: any) => ec.status == 'passed').length;
  }

  onFilterChange($event: any): void {
    if ($event == 'all') {
      this.tableTestResults = [...new Set(this.testResults)];
    } else {
      this.tableTestResults = [...new Set(this.testResults)].filter((tc: any) => tc.status === $event);
    }
  }

  showAttachments(attachments: any): void {
    Promise.all(attachments.map((path: any) =>
      getUrl({
        path,
        options: { expiresIn: 3600 }
      }).then(res => ({ src: res.url.href } as NzImage))
    )).then((urls) => this.nzImageService.preview(urls));
  }

  showComment(result: any) {
    this.selectedComment = result.comment;
  }

  showDetails(result: any) {
    this.testFeature.getTestCase(result.testCaseId).subscribe((res: any) => {
      this.selectedTestCase = { ...result, ...res.data.getTestCase };
      console.log(this.selectedTestCase);
    });
  }

  exportAsExcel() {
    this.resultsService.exportAsExcel(this.result);
  }
}
