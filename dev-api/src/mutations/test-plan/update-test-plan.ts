import { GraphQLError } from 'graphql';
import { IRequestContext, TestPlan, TestFeature, TestCase, EdgeCase } from '@qa/models';
import { Types } from 'mongoose';

type UpdateTestPlanArgs = {
  id: string,
  name: string,
  description?: string,
  environments: string[],
  features: {
    _id?: string,
    name: string,
    description?: string,
    url?: string,
    order: number,
    testCases: {
      _id?: string,
      name: string,
      description?: string,
      order: number,
      stepsToTest: {
        _id?: string,
        description: string
      }[]
      edgeCases: {
        _id?: string,
        title: string,
        expectation: string,
        order: number
      }[]
    }[]
  }[],
  deletedFeatures: string[],
  deletedTestCases: string[]
};

/**
 * Helper function to create a new test case along with its edge cases
 *
 * @param userId The user creating the test case
 * @param planId The plan the test case belongs to
 * @param featureId The feature the test case belongs to
 * @param testCase The test case to create
 * @param edgeCases The edge cases to create along with the test case
 */
const createNewTestCase = async (userId: any, planId: any, featureId: any, testCase: any, edgeCases: any[]) => {
  const newTestCase = await TestCase.create({
    user: userId,
    planId,
    featureId,
    name: testCase.name,
    description: testCase.description,
    order: testCase.order,
    stepsToTest: testCase.stepsToTest
  });

  const edgeCaseIds = [];
  for (let ec of edgeCases ?? []) {
    const edgeCase = await EdgeCase.create({
      user: userId,
      plan: planId,
      testCase: newTestCase._id,
      title: ec.title,
      expectation: ec.expectation,
      order: ec.order
    });
    edgeCaseIds.push(edgeCase._id);
  }

  await newTestCase.updateOne({ edgeCases: edgeCaseIds });
}

export const updateTestPlanMutator = async (parent: any, testPlanArgs: UpdateTestPlanArgs, context: IRequestContext) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { features, deletedFeatures, deletedTestCases } = testPlanArgs;

  await TestPlan.findOneAndUpdate({ _id: testPlanArgs.id }, {
    name: testPlanArgs.name,
    description: testPlanArgs.description,
    environments: testPlanArgs.environments
  });

  const featureBulkWrite: any[] = [];
  const testCaseBulkWrite: any[] = [];
  let edgeCaseBulkWrite: any[] = [];

  for (const formFeature of features) {
    if (formFeature._id) {
      featureBulkWrite.push({
        updateOne: {
          filter: { _id: formFeature._id },
          update: {
            $set: {
              name: formFeature.name,
              url: formFeature.url,
              order: formFeature.order
            }
          }
        }
      });

      for (let i = 0; i < formFeature.testCases.length; i++) {
        const formTestCase = formFeature.testCases[i];

        if (formTestCase?._id) {
          const idsToKeep: string[] = [];
          
          for (let edgeCase of formTestCase.edgeCases ?? []) {
            if (!edgeCase._id) {
              const newEdgeCase = await EdgeCase.create({
                user: context.user?.user._id,
                plan: testPlanArgs.id,
                testCase: formTestCase._id,
                title: edgeCase.title,
                expectation: edgeCase.expectation,
                order: edgeCase.order
              });

              idsToKeep.push((newEdgeCase._id as Types.ObjectId).toString());
            } else {
              edgeCaseBulkWrite.push({
                updateOne: {
                  filter: { _id: edgeCase._id, testCase: formTestCase._id },
                  update: {
                    $set: {
                      title: edgeCase.title,
                      expectation: edgeCase.expectation,
                      order: edgeCase.order
                    }
                  }
                }
              });

              idsToKeep.push(edgeCase._id);
            }
          }

          const edgeCases = await EdgeCase.find({ testCase: formTestCase._id });
          const deleteEdgeCaseIds = edgeCases.map((item) => (item._id as Types.ObjectId).toString()).filter((_id) => !idsToKeep.includes(_id));
          console.log('To delete', deleteEdgeCaseIds);
          edgeCaseBulkWrite.push({
            deleteMany: {
              filter: { _id: { $in: deleteEdgeCaseIds.map(_id => new Types.ObjectId(_id)) } }
            }
          });

          testCaseBulkWrite.push({
            updateOne: {
              filter: { _id: formTestCase._id, featureId: formFeature._id },
              update: {
                $set: {
                  name: formTestCase.name,
                  description: formTestCase.description,
                  order: formTestCase.order,
                  stepsToTest: formTestCase.stepsToTest
                }
              }
            }
          });
        } else {
          // Edge case: existing feature, new test case with new edge cases
          await createNewTestCase(
            context.user?.user._id,
            testPlanArgs.id,
            formFeature._id,
            formTestCase,
            formTestCase?.edgeCases ?? []
          );
        }
      }
    } else {
      // Edge case: new feature, new test cases with new edge cases
      const newFeature = await TestFeature.create({
        user: context.user?.user._id,
        planId: testPlanArgs.id,
        name: formFeature.name,
        description: formFeature.description,
        url: formFeature.url,
        order: formFeature.order
      });

      for (let i = 0; i < formFeature.testCases.length; i++) {
        await createNewTestCase(
          context.user?.user._id,
          testPlanArgs.id,
          newFeature._id,
          formFeature.testCases[i],
          formFeature.testCases[i]?.edgeCases ?? []
        );
      }
    }
  };

  deletedFeatures.forEach((_id: string) => {
    featureBulkWrite.push({
      deleteOne: {
        filter: { _id }
      }
    });
  });
  deletedTestCases.forEach((_id: string) => {
    testCaseBulkWrite.push({
      deleteOne: {
        filter: { _id }
      }
    })
  });

  await TestFeature.bulkWrite(featureBulkWrite);
  await TestCase.bulkWrite(testCaseBulkWrite);
  await EdgeCase.bulkWrite(edgeCaseBulkWrite);
}
