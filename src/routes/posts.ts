import { FastifyPluginAsync } from "fastify";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../handlers/posts.handler";
import fp from "fastify-plugin";
import { EditPostValidate, CreatePostValidate } from"../validators/post.validators";


const posts: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/posts", getAllPosts);

  fastify.get("/posts/:id", getPostById);

    fastify.post("/posts", { onRequest: [fastify.jwtauthenticate], schema: { body: CreatePostValidate} }, createPost);

  fastify.put(
    "/posts/:id",
      { onRequest: [fastify.jwtauthenticate], schema: { body: EditPostValidate} },
    updatePost
  );

  fastify.delete(
    "/posts/:id",
    { onRequest: [fastify.jwtauthenticate] },
    deletePost
  );
};

export default fp(posts);
