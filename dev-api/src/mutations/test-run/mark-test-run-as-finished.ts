import { TestRun, TestPlan } from "@qa/models";
import { calTestRunStats } from "../../utils";

export const markTestRunAsFinishedMutator = async (parent: any, { planId, testRunId }: any) => {
  const testRun = await TestRun.findOne({ planId, _id: testRunId });
  if (!testRun) {
    throw new Error('Testrun was not found');
  }

  await calTestRunStats(testRun);

  await testRun.updateOne({
    status: 'finished',
    finishedAt: new Date()
  });

  await TestPlan.findOneAndUpdate({ _id: planId }, { currentTestRunId: null, lastTestRunId: testRunId });
};
