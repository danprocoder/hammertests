import { GraphQLError } from 'graphql';
import { TestPlan, TestFeature, TestCase, EdgeCase, IRequestContext } from '@qa/models';

type Ordered<A> = A & { order: number };

interface CreateTestPlanArgs {
  name: string,
  description?: string,
  environments: {
    name: string,
    url: string
  }[],
  features: {
    name: string,
    description?: string,
    order: number,
    testCases: Ordered<{
      name: string,
      description?: string,
      stepsToTest?: {
        _id: string;
        description: string;
      }[],
      edgeCases: Ordered<{
        title: string,
        expectation: string
      }>[]
    }>[]
  }[]
};

export const createTestPlanMutator = async (parent: any, args: CreateTestPlanArgs, context: IRequestContext) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { name, description, environments, features } = args;
  const plan = await TestPlan.create({
    project: context.user.project._id,
    user: context.user.user._id,
    name,
    description,
    environments
  });

  for (let f of features) {
    const feature = await TestFeature.create({
      user: context.user.user._id,
      planId: plan._id,
      name: f.name,
      description: f.description,
      order: f.order
    });

    for (let tc of f.testCases) {
      // Created the edge cases first
      const testCase = await TestCase.create({
        user: context.user.user._id,
        planId: plan._id,
        featureId: feature._id,
        name: tc.name,
        description: tc.description,
        order: tc.order,
        stepsToTest: tc.stepsToTest
      });

      const edgeCases = await EdgeCase.insertMany((tc.edgeCases ?? []).map(ec => ({
        user: context.user?.user._id,
        testCase: testCase._id,
        title: ec.title,
        expectation: ec.expectation,
        order: ec.order
      })));

      const edgeCaseIds = edgeCases.map(ec => ec._id);
      await testCase.updateOne({ edgeCases: edgeCaseIds });
    }
  }
  
  return plan;
}

export type { CreateTestPlanArgs };
