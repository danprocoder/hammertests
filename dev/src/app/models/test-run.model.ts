
export type TestStatus = 'passed' | 'passed-with-warnings' | 'failed' | 'blocked' | 'needs-a-retest';

export interface ITestRunEdgeCase {
  edgeCaseId: IEdgeCase;
  issue?: IIssue;
  status: TestStatus;
}

export interface ITestRunStepToReproduce {
  _id?: string;
  step: string;
}

export interface ITestRunstat {
  totalPassed: number,
  totalFailed: number,
  totalBlocked: number,
  totalNeedsARetest: number,
  totalPassedWithWarnings: number,
  totalRun: number
}

export interface ITestRun {
  _id: string;
  planId: string;
  stat: ITestRunstat;
  status: 'running' | 'completed';
  testCases: ITestRunCase[];
  overallReport?: string;
  attachment?: string[];
  dateCreated?: string;
}

export interface ITestRunCase {
  _id?: string;
  testCaseId: string;
  edgeCases: ITestRunEdgeCase[];
  attachments?: string[];
  comment?: string;
}

export interface IIssue {
  _id?: string;
  title: string;
  description: string;
  stepsToReproduce: { step: string }[];
}
