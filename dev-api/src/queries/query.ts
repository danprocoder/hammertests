import { TestPlan, TestRunCase, TestRun, TestCase, IRequestContext } from '@qa/models';
import { GraphQLError } from 'graphql';

export const query = {
  testPlans: async (parent: any, args: any, context: IRequestContext) => {
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: {
          code: 'UNAUTHENTICATED'
        } 
      });
    }

    const plans = await TestPlan.find({
      project: context.user?.project._id
    }).sort({ createdAt: -1 });

    return plans;
  },
  testPlan: async (parent: any, args: any) => {
    return await TestPlan.findById(args.id)
  },
  getTestCase: async (parent: any, args: any) => {
    return await TestCase.findById(args.id);
  },
  getTestRunCases: async (parent: any, { planId, testRunId }: any) => {
    return await TestRunCase.find({ planId, testRunId }).populate('edgeCases.edgeCaseId');
  },
  getTestRuns: async (parent: any, { query }: any) => {
    return await TestRun.find(query).sort({ createdAt: -1 });
  },
  getTestRun: async (parent: any, args: any) => {
    const { id } = args;
    return await TestRun.findById(id);
  }
};
