
export type TestStatus = 'passed' | 'passed-with-warnings' | 'failed' | 'blocked' | 'needs-a-retest';

export interface ITestRunEdgeCase {
  edgeCaseId: IEdgeCase;
  issue?: Partial<IIssue>;
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
  totalRun: number,
  totalEdgeCases: number
}

export interface ITestRun {
  _id: string;
  code: string;
  planId: string;
  plan: { name: string };
  stat: ITestRunstat;
  status: 'running' | 'completed';
  testCases: ITestRunCase[];
  modulesToTest: string[];
  overallReport?: string;
  attachment?: string[];
  createdAt?: string;
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
  feature: ITestFeature;
  testCase: ITestCase;
  edgeCase: IEdgeCase;
  project: string;
  code: string;
  user: string;
  title: string;
  description: string;
  stepsToReproduce: { step: string }[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  attachments: string[];
  createdAt?: string;
}
