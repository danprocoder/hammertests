import { CodeGenerator } from "@qa/models";
import { Types } from "mongoose";

export class CodeGeneratorService {
  public static async generateCode(prefix: string, projectId: Types.ObjectId): Promise<string> {
    const next = await CodeGenerator.findOneAndUpdate({ project: projectId, prefix }, { $inc: { counter: 1 } }, { upsert: true, new: true });
    return `${next.prefix}-${next.counter.toString().padStart(3, '0')}`;
  }
}
