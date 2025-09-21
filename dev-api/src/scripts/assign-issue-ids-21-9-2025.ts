import { CodeGenerator, Issue, Project } from "@qa/models";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { CodeGeneratorService } from "../services/code-generator";

dotenv.config();

const run = async () => {
  const projects = await Project.find();

  for (let project of projects) {
    await CodeGenerator.deleteMany({ project: project._id, prefix: 'IS' });
    const issues = await Issue.find({ project: project._id });

    for (let issue of issues) {
      const code = await CodeGeneratorService.generateCode('IS', project._id);

      await issue.updateOne({ code });
    }
  }
}

mongoose.connect(process.env.MONGO_URI!).then(() => run()).catch((err) => {
  console.log(err.message);
});
