import { TestFeature } from '@qa/models';

export const testRunCaseQuery = {
  feature: async (testRun: any) => {
    return await TestFeature.findById(testRun.featureId);
  }
};
