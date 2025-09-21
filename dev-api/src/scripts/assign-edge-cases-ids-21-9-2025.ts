import { CodeGenerator, Project, EdgeCase, TestCase, TestPlan } from "@qa/models";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { CodeGeneratorService } from "../services/code-generator";

dotenv.config();

const run = async () => {
  const projects = await Project.find();

  for (let project of projects) {
    await CodeGenerator.deleteMany({ project: project._id, prefix: { $in: ['EC', 'TC'] } });

    const testPlanIds =(await TestPlan.find({ project: project._id })).map(tp => tp._id);

    const testCases = await TestCase.find({ planId: { $in: testPlanIds } });
    for (let tc of testCases) {
        const tcCode = await CodeGeneratorService.generateCode('TC', project._id);
        await tc.updateOne({ code: tcCode });

        const edgeCases = await EdgeCase.find({ testCase: tc });

        for (let edgeCase of edgeCases) {
            const code = await CodeGeneratorService.generateCode('EC', project._id);

            await edgeCase.updateOne({ code, $unset: { id: '' } });
        }
    }
  }
}

mongoose.connect(process.env.MONGO_URI!).then(() => run()).catch((err) => {
  console.log(err.message);
});
