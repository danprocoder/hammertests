import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { ApolloQueryResult } from '@apollo/client';
import ExcelJs from 'exceljs';
import { saveAs } from 'file-saver';
import { format as dateFormat } from 'date-fns';
import { ITestRunCase, ITestRunStepToReproduce } from '../../../models/test-run.model';

const statusColors: { [key: string]: string } = {
  'failed': 'DC2626',
  'passed': '2E8540',
  'passed-with-warnings': 'FACC15',
  'blocked': '4B5563',
  'needs-a-retest': '2563EB'
};

@Injectable({
  providedIn: 'root'
})
export class TestRun {

  constructor(private apollo: Apollo) { }

  startTest(planId: string, environment: string, variables: { key: string, value: string }[], modulesToTest: string[] | null): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: gql`${jsonToGraphQLQuery({
        mutation: {
          startTestRun: {
            __args: {
              planId,
              environment,
              variables,
              modulesToTest
            },
            _id: true
          }
        }
      })}`
    });
  }

  getTestRun(testRunId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        getTestRun(id: "${testRunId}")  {
          _id,
          environment,
          modulesToTest,
          createdAt
        }
      }`
    });
  }

  getRunTestCases(planId: string, testRunId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        getTestRunCases(planId: "${planId}", testRunId: "${testRunId}") {
          _id,
          testCaseId,
          edgeCases {
            _id,
            edgeCaseId {
              _id,
              title,
              expectation,
              order
            },
            issue {
              _id,
              title,
              description,
              stepsToReproduce {
                _id,
                step
              },
              attachments,
            },
            status
          }
        }
      }`
    });
  }

  getPlanTestRuns(query: { [k: string]: string }): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`${jsonToGraphQLQuery({
        query: {
          getTestRuns: {
            __args: { query },
            _id: true,
            plan: { name: true },
            stat: {
              totalRun: true,
              totalPassed: true,
              totalFailed: true,
              totalBlocked: true,
              totalNeedsARetest: true,
              totalPassedWithWarnings: true
            },
            createdAt: true,
            finishedAt: true
          }
        }
      })}`
    });
  }

  save(planId: string, testRunId: string, testCase: ITestRunCase): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: gql`${jsonToGraphQLQuery({ mutation: { editTestRunCase: { __args: { planId, testRunId, testCase }, _id: true } } })}`
    });
  }

  getResult(testRunId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: gql`query {
        getTestRun(id: "${testRunId}") {
          _id,
          plan {
            _id,
            name
          },
          stat {
            totalPassed,
            totalFailed,
            totalBlocked,
            totalNeedsARetest,
            totalPassedWithWarnings,
            totalRun
          },
          testCases {
            _id,
            testCaseId,
            name,
            description,
            edgeCases {
              _id,
              edgeCaseId {
                _id,
                title,
                expectation,
                order
              },
              status,
            },
            feature {
              name
            }
          },
          finishedAt,
          overallReport,
          attachments
        }
      }`
    });
  }

  finish(planId: string, testRunId: string): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: gql`mutation { markTestRunAsFinished(planId: "${planId}", testRunId: "${testRunId}") { _id } }`
    });
  }

  async exportAsExcel(data: any) {
    const workbook = new ExcelJs.Workbook();

    const sheet = workbook.addWorksheet('Test Cases');
    sheet.columns = [
      { header: 'Module', width: 40 },
      { header: 'Test Case', width: 45 },
      { header: 'Edge Case', width: 45 },
      { header: 'Status', width: 25 },
      { header: 'Steps to Reproduce', width: 50 },
      { header: 'Comment', width: 100 }
    ];
    sheet.getRow(1).font = { bold: true, size: 14 };

    let lastModule = '';
    let lastTestCase = '';
    let startRowCount = 1;

    data.testCases.sort((a: any, b: any) => a.order - b.order).forEach((testCase: any, index: number) => {
      testCase.edgeCases.sort((a: any, b: any) => a.edgeCaseId.order - b.edgeCaseId.order).forEach((edgeCase: any, ecIndex: number) => {
        startRowCount++;
        const rowIndex = startRowCount;
        sheet.getRow(rowIndex).font = { size: 14 };

        // Feature name
        if (lastModule != testCase.feature.name) {
          const colFeatureName = sheet.getCell(`A${rowIndex}`);
          colFeatureName.value = testCase.feature.name;
          colFeatureName.alignment = { vertical: 'top', wrapText: true };
          lastModule = testCase.feature.name;
        }

        // Test case name
        if (lastTestCase != testCase.name) {
          const colTestCaseName = sheet.getCell(`B${rowIndex}`);
          colTestCaseName.value = testCase.name;
          colTestCaseName.alignment = { vertical: 'top', wrapText: true };
          lastTestCase = testCase.name;
        }
        
        // Edge case titles
        const colEdgeCase = sheet.getCell(`C${rowIndex}`);
        colEdgeCase.value = `${edgeCase.edgeCaseId.title}\n\nExpected Result:\n${edgeCase.edgeCaseId.expectation}`;
        colEdgeCase.alignment = { vertical: 'top', wrapText: true };

        // Edge case status
        const colStatus = sheet.getCell(`D${rowIndex}`);
        colStatus.value = edgeCase.status?.replaceAll('-', ' ');
        colStatus.alignment = { vertical: 'middle' };
        colStatus.font = { size: 14, color: { argb: 'FFFFFF' } };

        const fillColor = statusColors[edgeCase.status];
        if (fillColor) {
          colStatus.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }

        // Edge case steps to reproduce
        const colSteps = sheet.getCell(`E${rowIndex}`);
        let steps = '';
        (edgeCase.stepsToReproduce ?? []).forEach((step: ITestRunStepToReproduce, index: number) => {
          steps += (index + 1) + '. ' + step.step + "\n"
        });
        colSteps.value = steps;
        colSteps.alignment = { wrapText: true, vertical: 'top' };

        // Edge case comment
        const colComment = sheet.getCell(`F${rowIndex}`);
        colComment.value = edgeCase.comment;
        colComment.alignment = { wrapText: true, vertical: 'top' };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${data.plan.name} - Test Results (${dateFormat(new Date(data.finishedAt), 'd MMM yyyy')}).xlsx`);
  }
}
