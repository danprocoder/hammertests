import { IUserDocument } from "@qa/models/user";
import { IProjectDocument } from "./project";
import { Logger } from "@aws-lambda-powertools/logger";

interface IUserContext {
  user: IUserDocument;
  project: IProjectDocument;
}

interface IRequestContext {
  user?: IUserContext | null,
  req: any;
  res: any;
  logger: Logger;
}

export type { IRequestContext };
