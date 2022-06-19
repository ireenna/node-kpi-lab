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
const got_1 = __importDefault(require("got"));
const UserRoute = (server, options) => __awaiter(void 0, void 0, void 0, function* () {
    //   server.get<{ Params: userParams }>('/users/:id', {}, async (request, reply) => {
    //       try {
    //           const ID = request.params.id;
    //           const { User } = server.db.models;
    //		const user = await User.findById(ID).populate('posts');
    //           if (!user) {
    //               return reply.code(404).send(`The user with ID=${ID} was not found`);
    //           }
    //           return reply.code(200).send(user);
    //       } catch (error) {
    //           request.log.error(error);
    //		return reply.code(500).send(error);
    //       }
    //});
    //   server.get('/users', {}, async (request, reply) => {
    //	try {
    //		const { User } = server.db.models;
    //		const users = await User.find({}).populate('posts');
    //		return reply.code(200).send(users);
    //	} catch (error) {
    //		request.log.error(error);
    //		return reply.code(500).send(error);
    //	}
    //});
    //server.put<{ Body: UserAttrs, Params: userParams }>('/users/:id', {}, async (request, reply) => {
    //       try {
    //           const ID = request.params.id;
    //           const { User } = server.db.models;
    //           let result = await User.findByIdAndUpdate(ID, request.body, {
    //               new: true
    //           });
    //           if (!result) {
    //               return reply.send(404);
    //           }
    //           await result.save();
    //           return reply.code(201).send(result);
    //       } catch (error) {
    //           request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //       }
    //});
    //server.delete<{ Params: userParams }>('/users/:id', {}, async (request, reply) => {
    //       try {
    //           const ID = request.params.id;
    //           const { User } = server.db.models;
    //		const post = await User.findByIdAndDelete(ID);
    //           if (!post) {
    //               return reply.code(404);
    //           }
    //           return reply.code(200).send({ Message: "User Deleted" });
    //       } catch (error) {
    //           request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //       }
    //   });
    //server.get('/posts', {}, async (request, reply) => {
    //	try {
    //		const { Posts } = server.db.models;
    //		const posts = await Posts.find({});
    //		return reply.code(200).send(posts);
    //	} catch (error) {
    //		request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //	}
    //});
    //   server.get<{ Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
    //       try {
    //           const ID = request.params.id;
    //           const { Posts } = server.db.models;
    //           const post = await Posts.findById(ID).populate('_user');
    //           if (!post) {
    //               return reply.send(404);
    //           }
    //           return reply.code(200).send(post);
    //       } catch (error) {
    //           request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //       }
    //   });
    //server.post<{ Body: PostsAttrs, Params: postsParams }>('/users/:id/posts', {}, async (request, reply) => {
    //	try {
    //		const { Posts, User } = server.db.models;
    //		const ID = request.params.id;
    //           const post = await Posts.addOne(request.body);
    //		const user = await User.findByIdAndUpdate(ID,
    //               {
    //				$push: {
    //					posts: post
    //                   }
    //			});
    //		await post.save();
    //		if (!user) {
    //               return reply.send(404);
    //           }
    //           await user.save();
    //           return reply.code(201).send(post);
    //	} catch (error) {
    //		request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //	}
    //});
    //server.put<{ Body: PostsAttrs, Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
    //	try {
    //		const ID = request.params.id;
    //		const { Posts } = server.db.models;
    //		let result = await Posts.findByIdAndUpdate(ID, request.body, {
    //			new: true
    //		});
    //		if (!result) {
    //			return reply.send(404);
    //		}
    //		await result.save();
    //		return reply.code(201).send(result);
    //	} catch (error) {
    //		request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //	}
    //});
    //server.delete<{ Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
    //	try {
    //		const ID = request.params.id;
    //		const { Posts } = server.db.models;
    //		const post = await Posts.findByIdAndDelete(ID);
    //		if (!post) {
    //			return reply.code(404);
    //		}
    //		return reply.code(200).send({ Message: "Post Deleted" } );
    //	} catch (error) {
    //		request.log.error(error);
    //		return reply.code(400).send({ Message: error });
    //	}
    //});
    server.get('/films/:name', {}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const name = request.params.name;
            var url = `https://api.themoviedb.org/3/search/movie?api_key=a769c1d1893614012adddf3f9aaa8f76&language=en-US&query=${name}&page=1&include_adult=false`;
            const response = yield (0, got_1.default)(url);
            console.log(response.body);
            return reply.code(200).send(response.body);
        }
        catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }));
});
exports.default = (0, fastify_plugin_1.default)(UserRoute);
