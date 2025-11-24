import { Model, Schema, Types, Document, model } from "mongoose";

interface ITaskLabel {
    _id: Types.ObjectId;
    project: Types.ObjectId;
    user: Types.ObjectId;
    name: String;
    color: String;
}

interface ITaskLabelDocument extends ITaskLabel, Document<Types.ObjectId> { }

interface ITaskLabelModel extends Model<ITaskLabelDocument> { }

const taskLabelSchema = new Schema<ITaskLabelDocument>({
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
    color: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TaskLabel = model<ITaskLabelDocument>('TaskLabel', taskLabelSchema, 'tasks.labels');

export type { ITaskLabel, ITaskLabelDocument, ITaskLabelModel };
export { TaskLabel };
