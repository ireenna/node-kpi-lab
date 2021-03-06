import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  hashPassword: string;
  avatar: string;
  isAdmin: boolean;
  posts: Schema.Types.ObjectId[];
  validatePassword(password: string): Promise<boolean>; //eslint-disable-line no-unused-vars
}
