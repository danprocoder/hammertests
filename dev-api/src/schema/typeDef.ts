import gql from 'graphql-tag';
import { DateTimeTypeDefinition } from 'graphql-scalars';

const typeDefs = gql`
  ${DateTimeTypeDefinition}

  type TestEnvironment {
    _id: ID,
    name: String,
    url: String
  }

  type TestPlan {
    _id: ID,
    name: String!,
    description: String,
    environments: [TestEnvironment],
    currentTestRun: TestRun,
    lastTestRun: TestRun,
    features: [TestFeature],
    numberOfTestCases: Int,
    createdAt: DateTime
  }

  type TestFeature {
    _id: ID,
    planId: String,
    name: String!,
    url: String,
    order: Int,
    testCases: [TestCase],
    createdAt: DateTime
  }

  type TestCaseStepToTest {
    _id: ID,
    description: String!
  }

  type TestCaseEdgeCase {
    _id: ID,
    title: String!,
    expectation: String!,
    order: Int
  }

  type TestCase {
    _id: ID,
    planId: ID,
    featureId: ID,
    name: String,
    description: String,
    order: Int,
    stepsToTest: [TestCaseStepToTest],
    edgeCases: [TestCaseEdgeCase],
    createdAt: DateTime
  }

  input TestRunVariableInput {
    key: String,
    value: String
  }

  input TestRunInput {
    _id: ID,
    planId: String,
    environment: String,
    variables: [TestRunVariableInput],
    modulesToTest: [String],
    stat: TestRunResultInput,
    status: String,
    testCases: [TestRunCaseInput]
  }
  
  input TestRunResultInput {
    totalPassed: Int,
    totalFailed: Int,
    totalBlocked: Int,
    totalNeedsARetest: Int,
    totalPassedWithWarnings: Int,
    totalRun: Int
  }

  type TestRun {
    _id: ID,
    planId: String,
    plan: TestPlan,
    environment: String,
    stat: TestRunResult,
    modulesToTest: [String],
    status: String,
    testCases: [TestRunCase],
    overallReport: String,
    attachments: [String],
    createdAt: DateTime,
    finishedAt: DateTime
  }

  type TestRunStepToReproduce {
    _id: ID,
    step: String!
  }

  type TestRunEdgeCase {
    _id: ID,
    edgeCaseId: TestCaseEdgeCase,
    status: ID,
    comment: String,
    attachments: [String],
    stepsToReproduce: [TestRunStepToReproduce]
  }

  type TestRunResult {
    totalPassed: Int,
    totalFailed: Int,
    totalBlocked: Int,
    totalNeedsARetest: Int,
    totalPassedWithWarnings: Int,
    totalRun: Int
  }

  type TestRunCase {
    _id: ID,
    planId: ID,
    feature: TestFeature,
    testRunId: ID,
    testCaseId: ID,
    name: String,
    description: String,
    edgeCases: [TestRunEdgeCase],
    createdAt: DateTime
  }

  input TestRunStepToReproduceInput {
    _id: ID,
    step: String
  }
  
  input TestRunEdgeCaseIssue {
    _id: ID,
    title: String,
    description: String,
    stepsToReproduce: [TestRunStepToReproduceInput]
  }

  input TestRunEdgeCaseInput {
    edgeCaseId: ID,
    issue: TestRunEdgeCaseIssue,
    status: String,
  }

  input TestRunCaseInput {
    _id: ID,
    testCaseId: ID,
    edgeCases: [TestRunEdgeCaseInput]
  }

  input TestCaseStepToTestInput {
    _id: ID,
    description: String!
  }

  input TestCaseEdgeCaseInput {
    _id: ID,
    title: String!,
    expectation: String,
    order: Int!
  }

  input TestCaseInput {
    _id: ID,
    featureId: ID,
    name: String!,
    description: String,
    order: Int!,
    stepsToTest: [TestCaseStepToTestInput],
    edgeCases: [TestCaseEdgeCaseInput]
  }

  input TestFeatureInput {
    _id: ID,
    name: String!,
    description: String,
    url: String,
    order: Int!,
    testCases: [TestCaseInput]
  }

  input EnvironmentInput {
    _id: ID,
    name: String,
    url: String
  }

  input AuthGoogleInput {
    clientId: String,
    client_id: String,
    select_by: String,
    credential: String
  }

  type User {
    firstName: String,
    lastName: String,
    email: String,
    picture: String,
    createdAt: DateTime
  }

  type UserSession {
    token: String,
    user: User,
    createdAt: DateTime
  }

  input TestRunsQueryInput {
    planId: ID,
    status: String
  }
  
  type Query {
    testPlans: [TestPlan],
    testPlan(id: ID): TestPlan,
    getTestCase(id: ID): TestCase,
    getTestRuns(query: TestRunsQueryInput): [TestRun],
    getTestRun(id: ID): TestRun,
    getTestRunCases(planId: ID, testRunId: ID): [TestRunCase]
  }

  type Mutation {
    authGoogle(auth: AuthGoogleInput): UserSession,
    createTestPlan(name: String, description: String, environments: [EnvironmentInput], features: [TestFeatureInput]): TestPlan,
    updateTestPlan(id: ID, name: String, description: String, environments: [EnvironmentInput], features: [TestFeatureInput], deletedFeatures: [String], deletedTestCases: [String]): TestPlan,
    startTestRun(planId: ID, environment: String, variables: [TestRunVariableInput], modulesToTest: [String]): TestRun,
    editTestRunCase(planId: ID, testRunId: ID, testCase: TestRunCaseInput): TestRunCase,
    updateTestRun(testRun: TestRunInput): TestRun,
    markTestRunAsFinished(planId: ID, testRunId: ID): TestRun,
    deleteTestPlan(id: ID!): Boolean
  }
`;

export { typeDefs };