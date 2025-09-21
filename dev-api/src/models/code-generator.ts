import { Document, model, Model, Schema, Types } from "mongoose";

interface ICodeGenerator {
  prefix: string;
  counter: number;
  project: Types.ObjectId
}

interface ICodeGeneratorDocument extends ICodeGenerator, Document<Types.ObjectId> {}

interface ICodeGeneratorModel extends Model<ICodeGeneratorDocument> {}

const codeGeneratorSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  counter: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const CodeGenerator = model<ICodeGeneratorDocument, ICodeGeneratorModel>('CodeGenerator', codeGeneratorSchema);

export type { ICodeGenerator, ICodeGeneratorDocument };
export { CodeGenerator };
