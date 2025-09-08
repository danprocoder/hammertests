import { Project, ProjectMember } from "@qa/models/project";
import { User, UserSession } from "../../models";
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const authGoogleMutator = async (parent: any, { auth }: any, context: any) => {
  console.log(auth, context);
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_KEY);
  const ticket = await client.verifyIdToken({
    idToken: auth.credential,
    audience: process.env.GOOGLE_CLIENT_KEY!,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Empty payload from google');
  }

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      picture: payload.picture
    });
  }

  // TODO: This is temporary code. Remove when we have features to manage projects
  let project = await Project.findOne({ createdBy: user._id });
  if (!project) {
    project = await Project.create({
      createdBy: user._id,
      name: uuidv4()
    });
    await ProjectMember.create({
      project: project._id,
      user: user._id
    });
  };

  const jwtPayload = {
    sub: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    picture: user.picture
  };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256' });

  const session = UserSession.create({ token, userId: user._id, googleCredential: auth.credential });

  return session;
};
