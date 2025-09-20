import { Model, model, Schema, Document } from "mongoose";

interface ITestFeature {
  user: Schema.Types.ObjectId,
  planId: Schema.Types.ObjectId,
  name: string,
  description: string,
  url: string,
  order: number
}

interface ITestFeatureDocument extends ITestFeature, Document {}

interface ITestFeatureModel extends Model<ITestFeatureDocument> {}

const testFeatureSchema = new Schema({
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
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  order: {
    type: Number,
    defaultValue: 0
  }
}, { timestamps: true });

const TestFeature = model<ITestFeatureDocument, ITestFeatureModel>('Feature', testFeatureSchema);

export { TestFeature };
export type { ITestFeature, ITestFeatureDocument };
