import { Component } from '@angular/core';
import { TestRun } from '@qa/test-run/services/test-run';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-run-test-history',
  templateUrl: './run-test-history.html',
  styleUrl: './run-test-history.scss',
  standalone: false
})
export class RunTestHistory {
  planId: any;
  results: any[] = [];

  constructor(private runTestService: TestRun, private route: ActivatedRoute) {
    this.route.params.subscribe(param => {
      this.planId = param['planId'];
    });
  }

  ngOnInit(): void {
    const query: any = {
      status: 'finished'
    };
    if (this.planId) {
      query.planId = this.planId;
    }
    this.runTestService.getPlanTestRuns(query).subscribe((res: any) => {
      this.results = res.data.getTestRuns;
    })
  }


  getDuration(row: any): string {
    if (!row.createdAt || !row.finishedAt) {
      return 'N/A';
    }
    
    const createdTimestamp = new Date(row.createdAt).getTime();
    const finishedTimestamp = new Date(row.finishedAt).getTime();

    const diff = (finishedTimestamp - createdTimestamp) / 1000 / 60 / 60;

    if (diff < 1) {
      return Math.round(diff / 60) + 'm';
    } else {
      return Math.round(diff) + 'h ' + Math.round(diff / 60) + 'm';
    }
  }
}
