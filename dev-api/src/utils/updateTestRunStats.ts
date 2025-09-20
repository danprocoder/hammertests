import { Logger } from "@aws-lambda-powertools/logger";
import { EdgeCase, TestCase, TestRunCase } from "@qa/models";
import { ITestRunDocument, TestRun } from "@qa/models/test-run";
import { Types } from "mongoose";

const logger = new Logger({ serviceName: 'qa-backend' });

export const syncDeleted = async (planId: Types.ObjectId): Promise<ITestRunDocument[]> => {
  const affectedTestRuns = await TestRun.find({ planId, status: { $ne: 'finished' } });
  const activeTestRunIds = affectedTestRuns.map(tr => tr._id);
  if (!activeTestRunIds.length) {
    return [];
  }

  logger.info('Syncing deletes', { activeTestRunIds })

  // Delete test run cases whose test case obj has being deleted
  const testCaseIds = (await TestCase.find({ planId })).map(tc => tc._id);
  // Add test plan id to the query so we don't delete testCases from other test plans
  const res = await TestRunCase.deleteMany({ testRunId: { $in: activeTestRunIds }, testCaseId: { $not: { $in: testCaseIds } } });
  logger.info('[On feature save]: Deleted test run cases that no longer have test cases', { planId, testCaseId: { $not: { $in: testCaseIds } }, deleted: res });

  // Delete test run edge cases whose edge obj has being deleted
  let refreshedTestRunCases = await TestRunCase.find({ testRunId: { $in: activeTestRunIds } }).populate('testCaseId', 'testRunId');
  for (let trc of refreshedTestRunCases) {
    const edgeCaseIds = (await EdgeCase.find({ testCase: trc.testCaseId })).map(ec => ec._id) as unknown as Types.ObjectId[];
    trc.edgeCases = trc.edgeCases.filter(rEdgeCase =>
      edgeCaseIds.find(id => id.equals(rEdgeCase.edgeCaseId))
    );
    await trc.save();
    logger.info('[On feature save]: Cleaned up edge cases on test run case', { testRunCaseId: trc._id,  });
  }

  return affectedTestRuns;
};

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
  const result = await TestRunCase.aggregate(pipeline).exec();
  logger.info('Stat aggregates retrieved', { result });

  const testCaseIds = (await TestCase.find({ planId: testRun.planId })).map(tc => tc._id);

  const totalEdgeCases = await EdgeCase.countDocuments({ 
    testCase: { $in: testCaseIds }
  });
  logger.info('Fetched total edgecases', { testCaseIds, totalEdgeCases });

  await testRun.updateOne({
    $set: {
      'stat.totalPassed': result[0]?.stat?.passed ?? 0,
      'stat.totalFailed': result[0]?.stat?.failed ?? 0,
      'stat.totalBlocked': result[0]?.stat?.blocked ?? 0,
      'stat.totalNeedsARetest': result[0]?.stat?.['needs-a-retest'] ?? 0,
      'stat.totalPassedWithWarnings': result[0]?.stat?.['passed-with-warnings'] ?? 0,
      'stat.totalRun': result[0]?.total ?? 0,
      'stat.totalEdgeCases': totalEdgeCases
    }
  });

  return testRun;
}
