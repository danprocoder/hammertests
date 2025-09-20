import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDef';
import { resolvers } from './gql-resolvers';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { User, UserSession, IRequestContext } from '@qa/models';
import { IProjectDocument, ProjectMember } from './models/project';
import { Logger } from '@aws-lambda-powertools/logger';

dotenv.config();

const reqContext = async ({ req, res }: any): Promise<IRequestContext> => {
  const logger = new Logger({ serviceName: 'qa-backend' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '');
  if (!token) {
    return { user: null, req, res, logger };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const user = await User.findOne({ _id: payload.sub });
    const session = await UserSession.findOne({ userId: payload.sub, token });

    if (!user || !session) {
      return { user: null, req, res, logger };
    }

    const project = await ProjectMember.findOne({ user: user._id }).populate('project');
    if (!project || !project.project) {
      return { user: null, req, res, logger };
    }

    return {
      user: {
        session,
        user,
        project: project.project as unknown as IProjectDocument
      },
      req,
      res,
      logger
    };
  } catch (err) {
    return { user: null, req, res, logger };
  }
};

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log(`Db Connected`);
}).catch((err) => {
  console.log(err.message);
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});

startStandaloneServer(server, {
  listen: {
    port: 4000
  },
  context: reqContext
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
