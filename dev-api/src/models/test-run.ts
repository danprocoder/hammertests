import { model, Schema, Document } from 'mongoose';

const testRunSchema = new Schema({
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
  environment: {
    type: Schema.Types.ObjectId,
    required: true
  },
  result: {
    totalPassed: {
      type: Number,
      default: 0
    },
    totalFailed: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    totalRun: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    default: 'running'
  },
  overallReport: {
    type: String
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
    defaultValue: []
  }]
}, { timestamps: true });

export const TestRun = model('TestRun', testRunSchema, 'testruns');
