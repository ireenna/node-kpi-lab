import { Schema, model } from 'mongoose'
import {IPostsDocument} from "../interfaces/posts";


export const PostsSchema: Schema<IPostsDocument> = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20
    },
    tags: [{ type:String }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
      timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at' }
  }
)


export const Posts = model<IPostsDocument>('Posts', PostsSchema)
