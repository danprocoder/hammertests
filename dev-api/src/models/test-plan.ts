import { Model, model, Schema, Document } from "mongoose";

interface ITestPlan {
  project: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
  name: string,
  description?: string,
  lastTestRunId?: Schema.Types.ObjectId,
  currentTestRunId?: Schema.Types.ObjectId,
  environments: {
    name: string,
    url: string
  }[]
}

interface ITestPlanDocument extends ITestPlan, Document {}

interface ITestPlanModel extends Model<ITestPlanDocument> {}

const testPlanSchema = new Schema<ITestPlanDocument>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  lastTestRunId: {
    type: Schema.Types.ObjectId,
    ref: 'TestRun'
  },
  currentTestRunId: {
    type: Schema.Types.ObjectId,
    ref: 'TestRun'
  },
  environments: [{
    name: {
      type: String
    },
    url: {
      type: String
    }
  }]
}, { timestamps: true })

const TestPlan = model<ITestPlanDocument, ITestPlanModel>('TestPlan', testPlanSchema, 'testplans');

export type { ITestPlan, ITestPlanDocument };
export { TestPlan };
