import { IUserDocument } from "@qa/models/user";
import { IUserSessionDocument } from "@qa/models/user-session";
import { IProjectDocument } from "./project";

interface IUserContext {
  user: IUserDocument;
  session: IUserSessionDocument;
  project: IProjectDocument;
}

interface IRequestContext {
  user?: IUserContext | null,
  req: any;
  res: any;
}

export type { IRequestContext };
