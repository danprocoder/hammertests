import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService, IDashboardData } from './dashboard.service';
import { ITestRun } from '../../models/test-run.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: false
})
export class Dashboard {
  data: IDashboardData | null = null;
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas?: ElementRef<HTMLCanvasElement>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(({ data }: any) => {
      this.data = data.dashboard;
      
      setTimeout(() => {
        this.showChart(this.data?.lastTestResult?.stat!);
      }, 250);
    });
  }

  showChart(stat: ITestRun['stat']): void {
    if (!stat) {
      return;
    }

    new Chart(this.pieChartCanvas?.nativeElement!, {
      type: 'pie',
      data: {
        labels: [
          `Passed: ${stat.totalPassed}`,
          `Passed with Warnings: ${stat.totalPassedWithWarnings}`,
          `Failed: ${stat.totalFailed}`,
          `Blocked: ${stat.totalBlocked}`,
          `Needs a Retest: ${stat.totalNeedsARetest}`
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

  getPercentage(testRun: ITestRun): number {
    return Math.floor((testRun.stat.totalRun / testRun.stat.totalEdgeCases) * 100);
  }
}
