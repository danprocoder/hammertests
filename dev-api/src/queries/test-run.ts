import { TestPlan, TestRunCase } from '@qa/models';

export const testRunQuery = {
  testCases: async (testRun: any) => {
    return await TestRunCase.find({ testRunId: testRun._id }).populate('edgeCases.edgeCaseId');
  },
  plan: async (testRun: any) => {console.log(testRun);
    return await TestPlan.findById(testRun.planId);
  }
};