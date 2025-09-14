import { GraphQLError } from 'graphql';
import { EdgeCase, IRequestContext, TestCase, TestFeature, TestPlan, TestRun, TestRunCase } from "@qa/models";

export const deleteTestPlanMutator = async (parent: any, testPlanArgs: { id: string }, context: IRequestContext) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  // TODO: Later, make sure we are checking for project here
  const testPlan = await TestPlan.findById(testPlanArgs.id);
  if (!testPlan) {
    throw new GraphQLError('Test plan not found', {
      extensions: {
        code: 'NOT_FOUND'
      } 
    });
  }

  // Delete associated features, test cases, and edge cases
  const features = await TestFeature.find({ planId: testPlan._id });
  for (let feature of features) {
    const testCases = await TestCase.find({ featureId: feature._id });

    const testCaseIds = testCases.map(tc => tc._id);
    await EdgeCase.deleteMany({ testCase: { $in: testCaseIds } });
    await TestCase.deleteMany({ featureId: feature._id });
  }
  await TestFeature.deleteMany({ planId: testPlan._id });

  // Delete associated test runs and test run cases
  const testRuns = await TestRun.find({ planId: testPlan._id });
  await TestRunCase.deleteMany({ testRunId: { $in: testRuns.map(tr => tr._id) } });
  await TestRun.deleteMany({ planId: testPlan._id });

  // Finally delete the test plan
  await testPlan.deleteOne();

  return true;
}
