import { Schema, Document, model, Model } from 'mongoose'

export interface PostsAttrs {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface PostsModel extends Model<PostsDocument> {
  addOne(doc: PostsAttrs): PostsDocument;
}

export interface PostsDocument extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  creator: Schema.Types.ObjectId;
}

export const PostsSchema: Schema = new Schema(
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
    tags: {
      type: Array,
      required: false,
      default: [],
      maximum: 15
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

PostsSchema.statics.addOne = (doc: PostsAttrs) => {
  return new Posts(doc)
}

export const Posts = model<PostsDocument, PostsModel>('Posts', PostsSchema)
