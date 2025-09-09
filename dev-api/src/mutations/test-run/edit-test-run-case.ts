import { GraphQLError } from 'graphql';
import { IRequestContext, TestCase, TestRun, TestRunCase } from "@qa/models";
import { updateTestRunCaseStats } from './mark-test-run-as-finished';
import { Types } from 'mongoose';

export const editTestRunCaseMutator = async (parent: any, args: any, req: IRequestContext) => {
  if (!req.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { planId, testRunId, testCase: testRunCase } = args;

  const dbTestCase = await TestCase.findOne({ _id: testRunCase.testCaseId, planId });
  if (!dbTestCase) {
    throw new GraphQLError('Test case not found');
  }
  
  let runTc = await TestRunCase.findOne({
    user: req.user.user._id,
    planId,
    testRunId,
    testCaseId: testRunCase.testCaseId
  });
  if (runTc) {
    await runTc.updateOne({
      testCaseId: testRunCase.testCaseId,
      edgeCases: testRunCase.edgeCases
    });
  } else {
    runTc = await TestRunCase.create({
      user: req.user.user._id,
      planId,
      testRunId,
      featureId: dbTestCase.featureId,
      testCaseId: testRunCase.testCaseId,
      name: dbTestCase.name,
      description: dbTestCase.description,
      edgeCases: testRunCase.edgeCases
    });
  }

  const stat = await updateTestRunCaseStats(new Types.ObjectId(testRunId));
  await TestRun.updateOne({ _id: testRunId }, { stat });

  return runTc;
};
