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

  const userId = context.user.user._id;
  await Promise.all([
    TestPlan.deleteOne({
      _id: testPlanArgs.id,
      user: userId
    }),
    TestFeature.deleteMany({
      planId: testPlanArgs.id,
      user: userId
    }),
    TestCase.deleteMany({
      planId: testPlanArgs.id,
      user: userId
    }),
    EdgeCase.deleteMany({
      planId: testPlanArgs.id,
      user: userId
    }),
    TestRun.deleteMany({
      planId: testPlanArgs.id,
      user: userId
    }),
    TestRunCase.deleteMany({
      planId: testPlanArgs.id,
      user: userId
    })
  ]);
}
