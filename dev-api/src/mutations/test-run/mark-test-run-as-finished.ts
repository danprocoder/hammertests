import mongoose from "mongoose";
import { TestCase, TestRunCase, TestRun, TestPlan } from "@qa/models";

export const markTestRunAsFinishedMutator = async (parent: any, { planId, testRunId }: any) => {
  const total = await TestCase.countDocuments({ planId });
  const pipeline = [
    {
      $match: {
        planId: new mongoose.Types.ObjectId(planId),
        testRunId: new mongoose.Types.ObjectId(testRunId)
      }
    },
    {
      $group: {
        _id: '$status',
        total: {
          $sum: 1
        }
      }
    }
  ];
  const aggregateResult = await TestRunCase.aggregate(pipeline).exec();

  let totalRun = 0, totalPassed = 0, totalFailed = 0;
  aggregateResult.forEach((res: any) => {
    if (res._id !== 'skipped') {
      totalRun += res.total;
    }

    if (res._id === 'passed') {
      totalPassed = res.total;
    } else if (res._id === 'failed') {
      totalFailed = res.total;
    }
  });
  await TestRun.findOneAndUpdate({ planId, _id: testRunId }, {
    status: 'finished',
    result: {
      total,
      totalRun,
      totalPassed,
      totalFailed
    },
    finishedAt: new Date()
  });

  await TestPlan.findOneAndUpdate({ _id: planId }, { currentTestRunId: null, lastTestRunId: testRunId });
};