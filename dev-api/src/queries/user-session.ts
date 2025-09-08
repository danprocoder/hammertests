import { User } from '@qa/models';

export const userSessionQuery = {
  user: async (parent: any, args: any) => {
    return await User.findOne({ _id: parent.userId });
  }
};
