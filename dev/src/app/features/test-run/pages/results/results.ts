import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TestRun } from '@qa/test-run/services/test-run';
import { ActivatedRoute } from '@angular/router';
import { getUrl } from '@aws-amplify/storage';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';
import { Chart, PieController } from 'chart.js/auto';
import { ITestRun } from '../../../../models/test-run.model';

Chart.register(PieController);

@Component({
  selector: 'app-results',
  templateUrl: './results.html',
  styleUrl: './results.scss',
  standalone: false
})
export class Results {
  resultId = '';
  result?: ITestRun & { plan: ITestPlan };
  testResults: any[] = [];
  tableTestResults: any[] = [];
  filterStatus = 'all';

  total = 0;
  totalRun = 0;
  passed = 0;
  failed = 0;
  blocked = 0;

  selectedTestCase: any = null;
  selectedComment: any = null;

  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas?: ElementRef<HTMLCanvasElement>;

  constructor(private resultsService: TestRun, private route: ActivatedRoute, private testFeature: TestFeature, private nzImageService: NzImageService, private cdr: ChangeDetectorRef) {
    this.route.params.subscribe(param => {
      this.resultId = param['id'];
    });
  }

  ngOnInit(): void {
    this.resultsService.getResult(this.resultId).subscribe(({ data: { getTestRun } }) => {
      this.result = getTestRun;
      this.testResults = getTestRun.testCases;
      this.tableTestResults = [...new Set(getTestRun.testCases)];
      this.blocked = this.total - this.totalRun;
        this.cdr.detectChanges();

      setTimeout(() => {
        this.showChart();

      }, 250);
    });
  }

  showChart(): void {
    const stat = this.result?.stat!;

    const chart = new Chart(this.pieChartCanvas?.nativeElement!, {
      type: 'pie',
      data: {
        labels: [
          `Passed: ${this.result?.stat.totalPassed}`,
          `Passed with Warnings: ${this.result?.stat.totalPassedWithWarnings}`,
          `Failed: ${this.result?.stat.totalFailed}`,
          `Blocked: ${this.result?.stat.totalBlocked}`,
          `Needs a Retest: ${this.result?.stat.totalNeedsARetest}`
        ],
        datasets: [
          {
            label: 'Votes',
            data: [
              stat.totalPassed,
              stat.totalPassedWithWarnings,
              stat.totalFailed,
              stat.totalBlocked,
              stat.totalNeedsARetest
            ],
            backgroundColor: [
              '#2E8540',
              '#FACC15',
              '#DC2626',
              '#4B5563',
              '#2563EB'
            ]
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = Number(ctx.raw);
                return ctx.label.split(':')[0] + ':' + Math.round((value / stat.totalRun) * 100) + '%'
              }
            }
          },
          legend: {
            position: 'right',
            fullSize: false,
            labels: {
              padding: 15
            }
          }
        }
      }
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
    });
  }

  exportAsExcel() {
    this.resultsService.exportAsExcel(this.result);
  }
}
