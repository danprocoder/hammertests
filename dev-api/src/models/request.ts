import { IUserDocument } from "@qa/models/user";
import { IUserSessionDocument } from "@qa/models/user-session";
import { IProjectDocument } from "./project";
import { Logger } from "@aws-lambda-powertools/logger";

interface IUserContext {
  user: IUserDocument;
  session: IUserSessionDocument;
  project: IProjectDocument;
}

interface IRequestContext {
  user?: IUserContext | null,
  req: any;
  res: any;
  logger: Logger;
}

export type { IRequestContext };
