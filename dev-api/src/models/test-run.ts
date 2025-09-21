import { model, Schema, Document, Types } from 'mongoose';

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
  project: Types.ObjectId,
  user: Types.ObjectId,
  planId: Types.ObjectId,
  code: string;
  environment: Types.ObjectId,
  stat: ITestRunstat,
  status: 'running' | 'finished',
  finishedAt: Date,
  variables: { key: string, value: string }[],
  modulesToTest: Types.ObjectId[]
}

export interface ITestRunDocument extends ITestRun, Document {}

const testRunSchema = new Schema<ITestRunDocument>({
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
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'TestPlan',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  environment: {
    type: Schema.Types.ObjectId,
    required: true
  },
  stat: {
    totalPassed: {
      type: Number,
      default: 0
    },
    totalFailed: {
      type: Number,
      default: 0
    },
    totalBlocked: {
      type: Number,
      default: 0
    },
    totalNeedsARetest: {
      type: Number,
      default: 0
    },
    totalPassedWithWarnings: {
      type: Number,
      default: 0
    },
    totalRun: {
      type: Number,
      default: 0
    },
    totalEdgeCases: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    default: 'running'
  },
  finishedAt: {
    type: Schema.Types.Date
  },
  variables: [{
    key: { type: String },
    value: { type: String }
  }],
  modulesToTest: [{
    type: Schema.Types.ObjectId,
    default: []
  }]
}, { timestamps: true });

export const TestRun = model<ITestRunDocument>('TestRun', testRunSchema, 'testruns');
