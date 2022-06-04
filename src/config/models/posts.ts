import { Schema, Document, model, Model } from 'mongoose';

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
}

export const PostsSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		tags: {
			type: Array,
			required: false,
			default:[]
		}
	},
	{
		timestamps: true
	}
);

PostsSchema.statics.addOne = (doc: PostsAttrs) => {
	return new Posts(doc);
};

export const Posts = model<PostsDocument, PostsModel>('Posts', PostsSchema);