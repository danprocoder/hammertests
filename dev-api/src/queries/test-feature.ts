import { TestCase } from '@qa/models';

export const testFeatureQuery = {
  testCases: async (feature: any) => {
    return await TestCase.find({ featureId: feature._id });
  }
};
