import { Document, Model, model, Schema, Types } from "mongoose";

interface IUserSession {
  token: string,
  userId: Types.ObjectId,
  googleCredential: string
}

interface IUserSessionDocument extends IUserSession, Document {}

interface IUserSessionModel extends Model<IUserSessionDocument> {}

const userSessionSchema = new Schema<IUserSessionDocument>({
  token: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  googleCredential: { type: String },
}, { timestamps: true });

const UserSession = model<IUserSessionDocument, IUserSessionModel>('UserSession', userSessionSchema);

export type { IUserSession, IUserSessionDocument };
export { UserSession };
