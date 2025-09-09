export interface ITestRunEdgeCase {
  edgeCaseId: IEdgeCase;
  status: string;
  attachments?: string[];
  stepsToReproduce?: ITestRunStepToReproduce[];
  comment?: string;
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
