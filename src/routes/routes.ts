import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import got from 'got';
import { Db } from '../config/db';
import { PostsAttrs } from '../config/models/posts';
import { User } from '../config/models/user';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
	}
}

interface userParams {
	id: string;
}
interface postsParams {
	id: string;
}
interface filmParams {
    name: string;
}

const UserRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
    
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
	server.get<{ Params: filmParams }>('/films/:name', {}, async (request, reply) => {
		try {
			const name = request.params.name;
			var url = `https://api.themoviedb.org/3/search/movie?api_key=a769c1d1893614012adddf3f9aaa8f76&language=en-US&query=${name}&page=1&include_adult=false`;
            const response = await got(url);
            console.log(response.body);
			return reply.code(200).send(response.body);
        } catch (error) {
            request.log.error(error);
			return reply.code(400).send(error);
        }
    });
};

export default fp(UserRoute);