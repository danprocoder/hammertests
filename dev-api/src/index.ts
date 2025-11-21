import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDef';
import { resolvers } from './gql-resolvers';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { User, IRequestContext } from '@qa/models';
import { IProjectDocument, ProjectMember } from './models/project';
import { Logger } from '@aws-lambda-powertools/logger';
import { CognitoJwtVerifier } from "aws-jwt-verify";

dotenv.config();

const reqContext = async ({ req, res }: any): Promise<IRequestContext> => {
  const logger = new Logger({ serviceName: 'qa-backend' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '');
  if (!token) {
    return { user: null, req, res, logger };
  }

  try {
    const props = {
      userPoolId: 'eu-west-2_y0s01EA0l',
      clientId: '51f7k8m5p1iff8hujdabed4nlb'
    };
    const verifier = CognitoJwtVerifier.create(props);
    const payload = await verifier.verify(token, { ...props, tokenUse: 'access' });

    const user = await User.findOne({ cognitoUsername: payload.username });

    if (!user) {
      return { user: null, req, res, logger };
    }

    const project = await ProjectMember.findOne({ user: user._id }).populate('project');
    if (!project || !project.project) {
      return { user: null, req, res, logger };
    }

    return {
      user: {
        user,
        project: project.project as unknown as IProjectDocument
      },
      req,
      res,
      logger
    };
  } catch (err) {
    console.error(err);
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
