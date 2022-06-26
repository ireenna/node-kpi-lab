import { FastifyPluginAsync } from "fastify";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../handlers/posts.handler";
import fp from "fastify-plugin";
import {
  EditPostValidate,
  CreatePostValidate,
} from "../validators/post.validators";
import {
  PostResponse,
  PostArrayResponse,
} from "../validators/response.validators";

const posts: FastifyPluginAsync = async (fastify): Promise<void> => {
  const root = "/posts";
  fastify.get(root, { schema: { response: PostArrayResponse } }, getAllPosts);

  fastify.get(
    root + "/:id",
    { schema: { response: PostResponse } },
    getPostById
  );

  fastify.post(
    root,
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: CreatePostValidate, response: PostResponse },
    },
    createPost
  );

  fastify.put(
    root + "/:id",
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: EditPostValidate, response: PostResponse },
    },
    updatePost
  );

  fastify.delete(
    root + "/:id",
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { response: PostResponse },
    },
    deletePost
  );
};

export default fp(posts);
