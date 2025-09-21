import mongoose, { Model, Schema, Types, Document } from "mongoose";

interface ITestStep {
  description: string;
}

interface ITestStepDocument extends ITestStep, Document {}

const stepsToTestSchema = new Schema<ITestStepDocument>({
  description: {
    type: String,
    required: true
  }
});

interface ITestCase {
  user: Types.ObjectId,
  planId: Types.ObjectId,
  featureId: Types.ObjectId,
  code: string,
  name: string,
  description: string,
  stepsToTest: ITestStep[],
  order: number
};

interface ITestCaseDocument extends ITestCase, Document<Types.ObjectId> {}

interface ITestCaseModel extends Model<ITestCaseDocument> {}

const testTestSchema = new Schema<ITestCaseDocument>({
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
  featureId: {
    type: Schema.Types.ObjectId,
    ref: 'TestFeature',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    defaultValue: 0
  },
  stepsToTest: [stepsToTestSchema]
}, { timestamps: true });

const TestCase = mongoose.model<ITestCaseDocument, ITestCaseModel>('TestCase', testTestSchema, 'testcases');

export type { ITestCase, ITestCaseDocument };
export { TestCase };
