import mongoose, { Model, Schema, Document, Types } from "mongoose";

type IssueStatus = 'open' | 'in_progress' | 'resolved';
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

interface IIssue {
  project: Types.ObjectId,
  user: Types.ObjectId,
  feature: Types.ObjectId,
  testCase: Types.ObjectId,
  edgeCase: Types.ObjectId,
  title: string,
  description: string,
  status: IssueStatus,
  priority: IssuePriority,
  stepsToReproduce: { step: string }[],
  attachments: string[]
}

interface IIssueDocument extends IIssue, Document {}

interface IIssueModel extends Model<IIssueDocument> {}

const issueSchema = new Schema<IIssueDocument>({
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
  feature: {
    type: Schema.Types.ObjectId,
    ref: 'Feature',
    required: true
  },
  testCase: {
    type: Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  edgeCase: {
    type: Schema.Types.ObjectId,
    ref: 'EdgeCase',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  stepsToReproduce: [{
    step: {
      type: String,
      required: true
    }
  }],
  attachments: [{
    type: String
  }]
}, { timestamps: true });

const Issue = mongoose.model<IIssueDocument, IIssueModel>('Issue', issueSchema, 'issues');

export type { IssueStatus, IssuePriority, IIssue, IIssueDocument };
export { Issue };
