import { CodeGenerator, Project, TestRun } from "@qa/models";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { CodeGeneratorService } from "../services/code-generator";

dotenv.config();

const run = async () => {
  const projects = await Project.find();

  for (let project of projects) {
    await CodeGenerator.deleteMany({ project: project._id, prefix: 'TR' });
    const testRuns = await TestRun.find({ project: project._id });

    for (let testRun of testRuns) {
      const code = await CodeGeneratorService.generateCode('TR', project._id);

      await testRun.updateOne({ code, $unset: { id: '' } });
    }
  }
}

mongoose.connect(process.env.MONGO_URI!).then(() => run()).catch((err) => {
  console.log(err.message);
});
