import { Document, model, Model, Schema, Types } from "mongoose";

export interface ITaskBoard {
    _id: Types.ObjectId,
    project: Types.ObjectId,
    user: Types.ObjectId,
    name: String,
    summary: String,
    createdAt: Date
}

export interface ITaskBoardDocument extends Document<ITaskBoard, Types.ObjectId> { }

export interface ITaskBoardModel extends Model<ITaskBoardDocument> { }

const schema = new Schema({
    project: {
        type: Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    summary: {
        type: String
    }
}, { timestamps: true });

export const TaskBoard = model<ITaskBoardDocument, ITaskBoardModel>('TaskBoard', schema, 'tasks.boards');