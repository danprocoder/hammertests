import { Schema, Document, model, Types } from "mongoose";

export interface IProject {
  createdBy: Types.ObjectId;
  name: string;
}

export interface IProjectDocument extends IProject, Document<Types.ObjectId> {}

export const Project = model<IProjectDocument>('Project', new Schema<IProjectDocument>({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String }
}, { timestamps: true }), 'projects');

export interface IProjectMember {
  project: Types.ObjectId;
  user: Types.ObjectId;
}

export interface IProjectMemberDocument extends IProjectMember, Document {}

export const ProjectMember = model<IProjectMemberDocument>('ProjectMember', new Schema<IProjectMemberDocument>({
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }), 'projects.members');
