"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const BlogRoute = (server, options) => __awaiter(void 0, void 0, void 0, function* () {
    server.get('/blogs', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Blog } = server.db.models;
            const blogs = yield Blog.find({});
            return reply.code(200).send(blogs);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }));
    server.post('/blogs', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Blog } = server.db.models;
            const blog = yield Blog.addOne(request.body);
            yield blog.save();
            return reply.code(201).send(blog);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }));
    server.get('/blogs/:id', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ID = request.params.id;
            const { Blog } = server.db.models;
            const blog = yield Blog.findById(ID);
            if (!blog) {
                return reply.send(404);
            }
            return reply.code(200).send(blog);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }));
    server.get('/posts', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Posts } = server.db.models;
            const posts = yield Posts.find({});
            return reply.code(200).send(posts);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }));
    server.post('/posts', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Posts } = server.db.models;
            const post = yield Posts.addOne(request.body);
            yield post.save();
            return reply.code(201).send(post);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }));
    server.get('/posts/:id', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ID = request.params.id;
            const { Posts } = server.db.models;
            const post = yield Posts.findById(ID);
            if (!post) {
                return reply.send(404);
            }
            return reply.code(200).send(post);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }));
    server.put('/posts/:id', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ID = request.params.id;
            const { Posts } = server.db.models;
            let result = yield Posts.findByIdAndUpdate(ID, request.body, {
                new: true
            });
            if (!result) {
                return reply.send(404);
            }
            yield result.save();
            return reply.code(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }));
    server.delete('/posts/:id', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ID = request.params.id;
            const { Posts } = server.db.models;
            const post = yield Posts.findByIdAndDelete(ID);
            if (!post) {
                return reply.send(404);
            }
            return reply.code(200).send({ Message: "Post Deleted" });
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }));
});
exports.default = (0, fastify_plugin_1.default)(BlogRoute);
