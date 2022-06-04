"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = exports.PostsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PostsSchema = new mongoose_1.Schema({
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
        default: []
    }
}, {
    timestamps: true
});
exports.PostsSchema.statics.addOne = (doc) => {
    return new exports.Posts(doc);
};
exports.Posts = (0, mongoose_1.model)('Posts', exports.PostsSchema);
