import { TestPlan, TestRunCase, TestRun, TestCase } from '@qa/models';

export const query = {
  testPlans: async () => {
    const plans = await TestPlan.find()

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
