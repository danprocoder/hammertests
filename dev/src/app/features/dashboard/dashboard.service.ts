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
            code,
            plan {
              name
            },
            stat {
              totalPassed,
              totalFailed,
              totalBlocked,
              totalNeedsARetest,
              totalPassedWithWarnings,
              totalRun,
              totalEdgeCases
            }
          },
          recentIssues {
            _id,
            code,
            title,
            status,
            priority,
            createdAt
          },
          recentTestRuns {
            _id,
            planId,
            plan {
              name
            },
            code,
            stat {
              totalPassed,
              totalFailed,
              totalBlocked,
              totalNeedsARetest,
              totalPassedWithWarnings,
              totalRun,
              totalEdgeCases
            },
            createdAt
          }
        }
      }`
    });
  }
}
