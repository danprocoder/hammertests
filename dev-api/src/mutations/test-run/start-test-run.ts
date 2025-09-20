import { GraphQLError } from 'graphql';
import { EdgeCase, IRequestContext, TestCase, TestPlan, TestRun } from "@qa/models";

export const startTestRunMutator = async (parent: any, args: any, { user }: IRequestContext) => {
  if (!user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { planId, environment, variables, modulesToTest } = args;

  const testCaseQuery: any = { planId };
  if (modulesToTest.length) {
    testCaseQuery.featureId = { $in: modulesToTest };
  }
  const testCaseIds = (await TestCase.find(testCaseQuery)).map(tc => tc._id);
  const sumEdgeCases = await EdgeCase.countDocuments({ testCase: { $in: testCaseIds } });

  const testRun = await TestRun.create({
    project: user.project._id,
    user: user.user._id,
    planId,
    environment,
    stat: {
      totalEdgeCases: sumEdgeCases,
    },
    variables,
    modulesToTest
  });

  await TestPlan.findByIdAndUpdate(planId, { currentTestRunId: testRun._id });

  return testRun;
};
