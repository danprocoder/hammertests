import { EdgeCase } from "@qa/models";
import { ITestCaseDocument } from "@qa/models/test-case";

export const testCaseQuery = {
  edgeCases: async (testCase: ITestCaseDocument) => {
    return EdgeCase.find({ testCase: testCase._id });
  },
};
