import mongoose, { Types, Document, Model, Schema } from "mongoose";

interface ITaskAcceptanceCriteria {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  given: string;
  when: string;
  then: string;
}

interface ITaskChecklistItem {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: String;
  completed: Boolean;
}

interface ITask {
  _id: Types.ObjectId;
  code: String;
  user: Types.ObjectId;
  project: Types.ObjectId;
  title: string;
  description: string;
  acceptanceCriteria: ITaskAcceptanceCriteria[];
  type: 'feature' | 'bug';
  status: 'open' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  labels: Types.ObjectId[];
  checklist: ITaskChecklistItem[];
  dueDate: Date;
  board?: Types.ObjectId;
}

interface ITaskDocument extends ITask, Document<Types.ObjectId> { }

interface ITaskModel extends Model<ITaskDocument> { }

const acceptanceCriteriaSchema = new Schema<ITaskAcceptanceCriteria>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  given: { type: String, required: true },
  when: { type: String, required: true },
  then: { type: String, required: true }
});

const taskChecklistItemSchema = new Schema<ITaskChecklistItem>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const taskSchema = new Schema<ITaskDocument>({
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
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  acceptanceCriteria: [acceptanceCriteriaSchema],
  checklist: [taskChecklistItemSchema],
  labels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TaskLabel',
      required: true
    }
  ],
  type: {
    type: String,
    enum: ['feature', 'bug'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'TaskBoard'
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

const Task = mongoose.model<ITaskDocument, ITaskModel>('Task', taskSchema, 'tasks');

export type { ITask, ITaskDocument };
export { Task };
