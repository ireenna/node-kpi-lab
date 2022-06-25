import { FastifyRequest } from "fastify";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  posts: Schema.Types.ObjectId[];
  validatePassword(password: string): Promise<boolean>;
}
