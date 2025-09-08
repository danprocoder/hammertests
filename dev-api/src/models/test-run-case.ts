import { Document, Model, model, Schema, Types } from "mongoose";

type TestCaseStatus = 'passed' | 'passed-with-warnings' | 'needs-a-retest' | 'blocked' | 'failed';

interface IStepToReproduce {
  step: string;
}

interface IStepToReproduceDocument extends IStepToReproduce, Document {}

const StepToReproduceSchema = new Schema<IStepToReproduceDocument>({
  step: {
    type: String,
    required: true
  }
});

interface ITestRunEdgeCase {
  edgeCaseId: Types.ObjectId,
  status: TestCaseStatus,
  comment?: string,
  attachments?: string[],
  stepsToReproduce?: IStepToReproduce[]
}

interface ITestRunEdgeCaseDocument extends ITestRunEdgeCase, Document {}

const testRunEdgeCaseSchema = new Schema<ITestRunEdgeCaseDocument>({
  edgeCaseId: {
    type: Schema.Types.ObjectId,
    ref: 'EdgeCase',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['passed', 'passed-with-warnings', 'needs-a-retest', 'blocked', 'failed']
  },
  comment: {
    type: String
  },
  attachments: [{
    type: String
  }],
  stepsToReproduce: [StepToReproduceSchema]
});

interface ITestRunCase {
  user: Types.ObjectId,
  planId: Types.ObjectId,
  testRunId: Types.ObjectId,
  featureId: Types.ObjectId,
  testCaseId: Types.ObjectId,
  name: string,
  description?: string,
  edgeCases: ITestRunEdgeCase[]
}

interface ITestRunCaseDocument extends ITestRunCase, Document {}

interface ITestRunCaseModel extends Model<ITestRunCaseDocument> {}

const testRunCaseSchema = new Schema<ITestRunCaseDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'TestPlan',
    required: true
  },
  testRunId: {
    type: Schema.Types.ObjectId,
    ref: 'TestRun',
    required: true
  },
  featureId: {
    type: Schema.Types.ObjectId,
    ref: 'TestFeature',
    required: true
  },
  testCaseId: {
    type: Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  edgeCases: [testRunEdgeCaseSchema]
}, { timestamps: true });

const TestRunCase = model<ITestRunCaseDocument, ITestRunCaseModel>('TestRunCase', testRunCaseSchema, 'testruns.testcases');

export { TestRunCase };
export type { ITestRunCase, ITestRunCaseDocument };
