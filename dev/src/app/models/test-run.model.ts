interface ITestRunEdgeCase {
  edgeCaseId: IEdgeCase;
  status: string;
  attachments?: string[];
  stepsToReproduce?: ITestRunStepToReproduce[];
  comment?: string;
}

interface ITestRunStepToReproduce {
  _id?: string;
  step: string;
}

interface ITestRun {
  _id: string;
  planId: string;
  result: {
    totalPassed: number;
    totalFailed: number;
  };
  status: 'running' | 'completed';
  testCases: ITestRunCase[];
  overallReport?: string;
  attachment?: string[];
  dateCreated?: string;
}

interface ITestRunCase {
  _id?: string;
  testCaseId: string;
  edgeCases: ITestRunEdgeCase[];
  attachments?: string[];
  comment?: string;
}
