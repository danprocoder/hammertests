import { EdgeCase, TestCase, TestRunCase } from "@qa/models";
import { ITestRunDocument } from "@qa/models/test-run";

export const calTestRunStats = async (testRun: ITestRunDocument): Promise<ITestRunDocument> => {
  if (!testRun) {
    throw new Error('Test run not found');
  }

  const pipeline = [
    {
      $match: {
        testRunId: testRun._id
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
  const res = (await TestRunCase.aggregate(pipeline).exec())[0];

  const testCases = await TestCase.find({ planId: testRun.planId });
  const totalEdgeCases = await EdgeCase.countDocuments({ 
    _id: { $in: testCases.map(tc => tc._id) }
  });

  await testRun.updateOne({
    $set: {
      'stat.totalPassed': res.stat.passed ?? 0,
      'stat.totalFailed': res.stat.failed ?? 0,
      'stat.totalBlocked': res.stat.blocked ?? 0,
      'stat.totalNeedsARetest': res.stat['needs-a-retest'] ?? 0,
      'stat.totalPassedWithWarnings': res.stat['passed-with-warnings'] ?? 0,
      'stat.totalRun': res.total ?? 0,
      'stat.totalEdgeCases': totalEdgeCases
    }
  });

  return testRun;
}
