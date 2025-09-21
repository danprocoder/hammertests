import { GraphQLError } from 'graphql';
import { TestPlan, TestFeature, IRequestContext } from '@qa/models';
import { TestCaseService } from '../../services/test-case-service';

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
      await TestCaseService.createNewTestCase(
        context.user.project._id,
        context.user.user._id,
        plan._id,
        feature._id,
        tc,
        tc.edgeCases
      );
    }
  }
  
  return plan;
}

export type { CreateTestPlanArgs };
