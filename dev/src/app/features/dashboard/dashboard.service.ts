import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { ITestRun, IIssue } from "../../models/test-run.model";

export interface IDashboardData {
  openIssues: number;
  inProgressIssues: number;
  lastTestResult: ITestRun | null;
  recentIssues: IIssue[];
  recentTestRuns: ITestRun[];
}

@Injectable()
export class DashboardService {
  constructor(private apollo: Apollo) {}

  getDashboardData() {
    return this.apollo.query<{ dashboard: IDashboardData }>({
      query: gql`query {
        dashboard {
          openIssues,
          inProgressIssues,
          lastTestResult {
            planId,
            stat {
              totalPassed,
              totalFailed,
              totalBlocked,
              totalNeedsARetest,
              totalPassedWithWarnings,
              totalRun
            }
          },
          recentIssues {
            _id,
            title,
            status,
            priority,
            createdAt
          },
          recentTestRuns {
            _id,
            planId,
            createdAt
          }
        }
      }`
    });
  }
}
