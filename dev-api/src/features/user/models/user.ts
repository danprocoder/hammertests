import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser {
  project: Types.ObjectId;
  firstName?: string,
  lastName?: string,
  email: string,
  picture?: string,
  cognitoUsername: string,
  createdAt: any,
  updatedAt: any
};

interface IUserDocument extends IUser, Document<Types.ObjectId> { }

interface IUserModel extends mongoose.Model<IUserDocument> { }

const userSchema = new Schema<IUserDocument>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  picture: { type: String },
  cognitoUsername: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema, 'users');

export type { IUser, IUserDocument };
export { User };
