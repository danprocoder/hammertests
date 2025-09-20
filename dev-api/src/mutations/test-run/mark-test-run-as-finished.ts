import { TestRunCase, TestRun, TestPlan } from "@qa/models";
import { ITestRunstat } from "@qa/models/test-run";
import { Types } from "mongoose";

export const updateTestRunCaseStats = async (_id: Types.ObjectId): Promise<Omit<ITestRunstat, 'totalEdgeCases'>> => {
  const pipeline = [
    {
      $match: {
        testRunId: _id,
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
        count: {
          $sum: 1
        }
      }
    },
    {
      $group: {
        _id: null,
        statuses: {
          $push: { k: '$_id', v: '$count'}
        },
        total: { $sum: "$count" }
      }
    },
    {
      $project: {
        _id: 0,
        stat: {
          $arrayToObject: '$statuses'
        },
        total: 1
      }
    }
  ];
  const edgeCases = await TestRunCase.aggregate(pipeline).exec();

  const res = edgeCases[0];
  return {
    totalPassed: res.stat.passed ?? 0,
    totalFailed: res.stat.failed ?? 0,
    totalBlocked: res.stat.blocked ?? 0,
    totalNeedsARetest: res.stat['needs-a-retest'] ?? 0,
    totalPassedWithWarnings: res.stat['passed-with-warnings'] ?? 0,
    totalRun: res.total ?? 0
  };

}

export const markTestRunAsFinishedMutator = async (parent: any, { planId, testRunId }: any) => {
  const testRun = await TestRun.findOne({ planId, _id: testRunId });
  if (!testRun) {
    throw new Error('Testrun was not found');
  }

  const stat = await updateTestRunCaseStats(testRun._id as any);

  await testRun.updateOne({
    stat,
    status: 'finished',
    finishedAt: new Date()
  });

  await TestPlan.findOneAndUpdate({ _id: planId }, { currentTestRunId: null, lastTestRunId: testRunId });
};
