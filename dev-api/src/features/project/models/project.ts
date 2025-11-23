import { Schema, Document, model, Types } from "mongoose";

export interface IProject {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  name: string;
  description: string;
  environments?: {
    _id?: Types.ObjectId;
    name: string;
    url: string;
  }[];
  createdAt: Date;
}

export interface IProjectDocument extends IProject, Document<Types.ObjectId> { }

export const Project = model<IProjectDocument>('Project', new Schema<IProjectDocument>({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  description: { type: String },
  environments: [{
    name: { type: String },
    url: { type: String }
  }]
}, { timestamps: true }), 'projects');

export interface IProjectMember {
  project: Types.ObjectId;
  user: Types.ObjectId;
}

export interface IProjectMemberDocument extends IProjectMember, Document<Types.ObjectId> { }

export const ProjectMember = model<IProjectMemberDocument>('ProjectMember', new Schema<IProjectMemberDocument>({
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }), 'projects.members');
