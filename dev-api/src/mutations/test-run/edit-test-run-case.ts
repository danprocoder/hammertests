import { GraphQLError } from 'graphql';
import { IRequestContext, Issue, TestCase, TestRun, TestRunCase } from "@qa/models";
import { calTestRunStats } from '../../utils';
import { CodeGeneratorService } from '../../services/code-generator';

export const editTestRunCaseMutator = async (parent: any, args: any, context: IRequestContext) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { planId, testRunId, testCase: testRunCase } = args;

  const testRun = await TestRun.findOne({ _id: testRunId, planId });
  if (!testRun) {
    context.logger.error('Test run not found on test run case edit', { testRunId, planId });
    throw new GraphQLError('Test run not found');
  }

  const dbTestCase = await TestCase.findOne({ _id: testRunCase.testCaseId, planId });
  if (!dbTestCase) {
    context.logger.error('Test case not found on test run case edit', { testRunCaseId: testRunCase.testCaseId, planId });
    throw new GraphQLError('Test case not found');
  }
  
  let runTc = await TestRunCase.findOne({
    user: context.user.user._id,
    planId,
    testRunId,
    testCaseId: testRunCase.testCaseId
  });

  // Edgecases need to be an id
  for (const edgeCase of testRunCase.edgeCases) {
    if (edgeCase.issue) {
      if (edgeCase.issue._id) {
        await Issue.updateOne({ _id: edgeCase.issue._id, edgeCase: edgeCase.edgeCaseId }, {
          title: edgeCase.issue.title,
          description: edgeCase.issue.description,
          stepsToReproduce: edgeCase.issue.stepsToReproduce
        });
        edgeCase.issue = edgeCase.issue._id;
      } else {
        const issueCode = await CodeGeneratorService.generateCode('IS', context.user.project._id);

        const newIssue = await Issue.create({
          project: context.user.project._id,
          user: context.user.user._id,
          feature: dbTestCase.featureId,
          testCase: dbTestCase._id,
          edgeCase: edgeCase.edgeCaseId,
          code: issueCode,
          title: edgeCase.issue.title,
          description: edgeCase.issue.description,
          stepsToReproduce: edgeCase.issue.stepsToReproduce
        });

        edgeCase.issue = newIssue._id;
      }
    }
  }

  if (runTc) {
    await runTc.updateOne({
      testCaseId: testRunCase.testCaseId,
      edgeCases: testRunCase.edgeCases
    });
  } else {
    runTc = await TestRunCase.create({
      user: context.user.user._id,
      planId,
      testRunId,
      featureId: dbTestCase.featureId,
      testCaseId: testRunCase.testCaseId,
      name: dbTestCase.name,
      description: dbTestCase.description,
      edgeCases: testRunCase.edgeCases
    });
  }

  await calTestRunStats(testRun);

  return runTc;
};
