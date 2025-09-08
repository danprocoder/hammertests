import { GraphQLError } from 'graphql';
import { IRequestContext, TestPlan, TestRun } from "@qa/models";

export const startTestRunMutator = async (parent: any, args: any, { user }: IRequestContext) => {
  if (!user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { planId, environment, variables, modulesToTest } = args;
  const testRun = await TestRun.create({
    project: user.project._id,
    user: user.user._id,
    planId,
    environment,
    variables,
    modulesToTest
  });

  await TestPlan.findByIdAndUpdate(planId, { currentTestRunId: testRun._id });

  return testRun;
};
