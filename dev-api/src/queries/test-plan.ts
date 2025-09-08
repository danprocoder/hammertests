import { TestRun, TestCase, TestFeature } from '@qa/models';

export const testPlanQuery = {
  features: async (plan: any) => {
    const features = await TestFeature.find({ planId: plan._id });
    return features;
  },
  currentTestRun: async (plan: any) => {
    if (plan.currentTestRunId) {
      return await TestRun.findById(plan.currentTestRunId);
    }

    return null;
  },
  lastTestRun: async (plan: any) => {
    if (plan.lastTestRunId) {
      return await TestRun.findById(plan.lastTestRunId)
    }

    return null;
  },
  numberOfTestCases: async (plan: any) => {
    return await TestCase.countDocuments({ planId: plan._id  })
  }
};