interface IEdgeCase {
  _id: string;
  title: string;
  expectation: string;
  order: number;
}

interface IStepToTest {
  _id: string;
  description: string;
}

interface ITestPlan {
  numberOfTestCases: number;
  _id: string;
  name: string;
  lastTestRun?: {
    _id: string;
    createdAt: string;
  },
  currentTestRun?: {
    _id: string;
    createdAt: string;
  }
  features: ITestFeature[];
  description?: string;
  dateCreated: string;
}

interface ITestFeature {
  _id: string;
  planId: string;
  name: string;
  description?: string;
  testCases?: ITestCase[];
  dateCreated: string;
}

interface ITestCase {
  _id: string;
  featureId: string;
  name: string;
  description?: string;
  order: number;
  stepsToTest?: IStepToTest[];
  edgeCases: IEdgeCase[];
  dateCreated: string;
}
