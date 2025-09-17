import { GraphQLError } from 'graphql';
import { IRequestContext, Issue } from '@qa/models';

export const editIssueMutator = async (parent: any, args: any, context: IRequestContext) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: {
        code: 'UNAUTHENTICATED'
      } 
    });
  }

  const { id, issue } = args;

  const updated = await Issue.findOneAndUpdate({ _id: id, project: context.user.project._id }, {
    ...issue
  }).populate('edgeCase');

  return updated;
};
