"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = exports.blogSchema = exports.validateEmail = void 0;
const mongoose_1 = require("mongoose");
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
exports.blogSchema = new mongoose_1.Schema({
    //_id: Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [exports.validateEmail, 'Please fill a valid email address'],
        maxLength: 25
    },
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    content: {
        type: String,
        required: true,
        maxLength: 300
    },
    category: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Posts' }]
}, {
    timestamps: true
});
exports.blogSchema.statics.addOne = (doc) => {
    return new exports.Blog(doc);
};
exports.Blog = (0, mongoose_1.model)('Blog', exports.blogSchema);
