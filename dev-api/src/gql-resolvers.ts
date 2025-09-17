import { DateTimeResolver } from 'graphql-scalars';
import { authGoogleMutator } from './mutations/auth/auth-google';
import { createTestPlanMutator } from './mutations/test-plan/create-test-plan';
import { updateTestPlanMutator } from './mutations/test-plan/update-test-plan';
import { markTestRunAsFinishedMutator } from './mutations/test-run/mark-test-run-as-finished';

import { query, testPlanQuery, testFeatureQuery, testRunQuery, testRunCaseQuery, userSessionQuery } from '@qa/query';

import { editTestRunCaseMutator } from './mutations/test-run/edit-test-run-case';
import { startTestRunMutator } from './mutations/test-run/start-test-run';
import { deleteTestPlanMutator } from './mutations/test-plan/delete-test-plan';
import { testCaseQuery } from './queries/test-case';
import { editIssueMutator } from './mutations/issue/edit-issue';

const resolvers = {
  DateTime: DateTimeResolver,
  Query: query,
  TestPlan: testPlanQuery,
  TestFeature: testFeatureQuery,
  TestCase: testCaseQuery,
  TestRun: testRunQuery,
  TestRunCase: testRunCaseQuery,
  UserSession: userSessionQuery,
  Mutation: {
    authGoogle: authGoogleMutator,
    createTestPlan: createTestPlanMutator,
    updateTestPlan: updateTestPlanMutator,
    deleteTestPlan: deleteTestPlanMutator,
    startTestRun: startTestRunMutator,
    editTestRunCase: editTestRunCaseMutator,
    markTestRunAsFinished: markTestRunAsFinishedMutator,
    editIssue: editIssueMutator
  }
};

export { resolvers };