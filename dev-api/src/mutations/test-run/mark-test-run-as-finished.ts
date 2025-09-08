import mongoose from "mongoose";
import { TestCase, TestRunCase, TestRun, TestPlan } from "@qa/models";

export const updateTestRunStats = async (testRun: any) => {
  const edgeCases = await TestRunCase.aggregate([
    {
      $match: {
        testRunId: testRun._id,
      }
    },
    {
      $unwind: {
        path: '$edgeCases'
      }
    },
    {
      $group: {
        _id: '$edgeCases.status',
        count: { $sum: 1 }
      }
    }
  ]).exec();
  console.log(edgeCases);
}

export const markTestRunAsFinishedMutator = async (parent: any, { planId, testRunId }: any) => {
  const testRun = await TestRun.find({ planId, testRunId });

  await updateTestRunStats(testRun);

  await TestRun.findOneAndUpdate({ planId, _id: testRunId }, {
    status: 'finished',
    stat: {
      totalRun: 0,
      totalPassed: 0,
      totalFailed: 0,
      totalBlocked: 0
    },
    finishedAt: new Date()
  });

  await TestPlan.findOneAndUpdate({ _id: planId }, { currentTestRunId: null, lastTestRunId: testRunId });
};