import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Db } from '../config/index';
import { BlogAttrs } from '../config/models/blogs';
import { PostsAttrs } from '../config/models/posts';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
	}
}

interface blogParams {
	id: string;
}
interface postsParams {
	id: string;
}

const BlogRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
	server.get('/blogs', {}, async (request, reply) => {
		try {
			const { Blog } = server.db.models;

			const blogs = await Blog.find({});

			return reply.code(200).send(blogs);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.post<{ Body: BlogAttrs }>('/blogs', {}, async (request, reply) => {
		try {
			const { Blog } = server.db.models;

			const blog = await Blog.addOne(request.body);
			await blog.save();
			return reply.code(201).send(blog);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.get<{ Params: blogParams }>('/blogs/:id', {}, async (request, reply) => {
		try {
			const ID = request.params.id;
			const { Blog } = server.db.models;
			const blog = await Blog.findById(ID);

			if (!blog) {
				return reply.send(404);
			}

			return reply.code(200).send(blog);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
	server.get('/posts', {}, async (request, reply) => {
		try {
			const { Posts } = server.db.models;

			const posts = await Posts.find({});

			return reply.code(200).send(posts);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.post<{ Body: PostsAttrs }>('/posts', {}, async (request, reply) => {
		try {
			const { Posts } = server.db.models;

			const post = await Posts.addOne(request.body);
			await post.save();
			return reply.code(201).send(post);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.get<{ Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
		try {
			const ID = request.params.id;
			const { Posts } = server.db.models;
			const post = await Posts.findById(ID);

			if (!post) {
				return reply.send(404);
			}

			return reply.code(200).send(post);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
	server.put<{ Body: PostsAttrs, Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
		try {
			const ID = request.params.id;
			const { Posts } = server.db.models;

			let result = await Posts.findByIdAndUpdate(ID, request.body, {
				new: true
			});
			if (!result) {
				return reply.send(404);
			}
			await result.save();
			return reply.code(201).send(result);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	server.delete<{ Params: postsParams }>('/posts/:id', {}, async (request, reply) => {
		try {
			const ID = request.params.id;
			const { Posts } = server.db.models;
			const post = await Posts.findByIdAndDelete(ID);

			if (!post) {
				return reply.send(404);
			}

			return reply.code(200).send({ Message: "Post Deleted" } );
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
};

export default fp(BlogRoute);