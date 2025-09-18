import { TestPlan, TestRunCase, TestRun, TestCase, IRequestContext, Issue, IssueStatus, IIssue } from '@qa/models';
import { ITestRun } from '@qa/models/test-run';
import { GraphQLError } from 'graphql';

export interface IDashboardData {
  openIssues: number;
  inProgressIssues: number;
  lastTestResult: ITestRun | null;
  recentIssues: IIssue[];
  recentTestRuns: ITestRun[];
}

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
    return await TestRunCase.find({ planId, testRunId }).populate('edgeCases.edgeCaseId').populate('edgeCases.issue');
  },
  getTestRuns: async (parent: any, { query }: any) => {
    return await TestRun.find(query).sort({ createdAt: -1 });
  },
  getTestRun: async (parent: any, args: any) => {
    const { id } = args;
    return await TestRun.findById(id);
  },
  issues: async (parent: any, args: any, context: IRequestContext) => {
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: {
          code: 'UNAUTHENTICATED'
        } 
      });
    }

    const issues = await Issue.find({
      project: context.user.project._id
    }).populate(['edgeCase', 'testCase', 'feature']).sort({ createdAt: -1 });

    return issues;
  },
  dashboard: async (parent: any, args: any, context: IRequestContext): Promise<IDashboardData> => {
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: {
          code: 'UNAUTHENTICATED'
        } 
      });
    }

    const openIssues = await Issue.countDocuments({
      project: context.user.project._id,
      status: { $in: ['open', 'in_progress'] as IssueStatus[] }
    });

    const inProgressIssues = await Issue.countDocuments({
      project: context.user.project._id,
      status: 'in_progress' as IssueStatus
    });

    const recentIssues = await Issue.find({
      project: context.user.project._id,
      status: { $in: ['open', 'in_progress'] as IssueStatus[] }
    }).sort({ createdAt: -1 }).limit(5);

    const testRuns = await TestRun.find({
      project: context.user.project._id,
      status: { $ne: 'finished' }
    }).sort({ createdAt: -1 }).limit(5);

    const lastTestRunResult = await TestRun.findOne({
      project: context.user.project._id,
      status: 'finished'
    }).sort({ createdAt: -1 });

    return {
      openIssues,
      inProgressIssues,
      lastTestResult: lastTestRunResult,
      recentIssues,
      recentTestRuns: testRuns
    }
  }
};
