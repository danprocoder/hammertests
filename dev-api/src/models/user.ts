import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser {
  firstName: string,
  lastName: string,
  email: string,
  picture: string,
  createdAt: any,
  updatedAt: any
};

interface IUserDocument extends IUser, Document<Types.ObjectId> {}

interface IUserModel extends mongoose.Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  picture: { type: String }
}, { timestamps: true });

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema, 'users');

export type { IUser, IUserDocument };
export { User };
