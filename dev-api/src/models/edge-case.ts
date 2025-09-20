import mongoose, { Model, Schema, Document, Types } from "mongoose";

interface IEdgeCase {
  user: Types.ObjectId,
  testCase: Types.ObjectId,
  title: string,
  expectation: string,
  order: number
}

interface IEdgeCaseDocument extends IEdgeCase, Document {}

interface IEdgeCaseModel extends Model<IEdgeCaseDocument> {}

const edgeCaseSchema = new Schema<IEdgeCaseDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testCase: {
    type: Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  expectation: {
    type: String,
    required: true
  },
  order: {
    type: Number
  }
}, { timestamps: true });

const EdgeCase = mongoose.model<IEdgeCaseDocument, IEdgeCaseModel>('EdgeCase', edgeCaseSchema, 'testcases.edgecases');

export type { IEdgeCase, IEdgeCaseDocument };
export { EdgeCase };
