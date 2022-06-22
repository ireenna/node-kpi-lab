import Mongoose = require("mongoose");
import Document = Mongoose.Document;
import Schema = Mongoose.Schema;

export interface IPostsDocument extends Document {
    title: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    creator: Schema.Types.ObjectId;
}