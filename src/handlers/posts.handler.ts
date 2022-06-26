import { FastifyRequest, FastifyReply } from "fastify";
import { Posts as Post } from "../config/models/posts";
import { User } from "../config/models/user";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { FromSchema } from "json-schema-to-ts";
import {
  EditPostValidate,
  CreatePostValidate,
} from "../validators/post.validators";

export const getAllPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    return await Post.find({}).exec();
  } catch (error) {
    return error;
  }
};

export const getPostById = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const post = await Post.findById(request.params.id).exec();
    if (!post)
        return reply.notFound("Post was not found");

    return post;
  } catch (error) {
      return error;
  }
};

export const createPost = async (
  request: FastifyRequest<{
    Body: FromSchema<typeof CreatePostValidate>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { title, content, category, tags } = request.body;
    const token = request.headers.authorization?.replace("Bearer ", "");
    const ID = jwtDecode<JwtPayload>(token ?? "").sub;
    const post = await Post.create({
      title,
      content,
      category,
      tags,
      creator: ID,
    });
    if (post) {
        await User.findByIdAndUpdate(ID,
            {
                $push: {
                    posts: post,
                },
            }).exec();
        return post;
    } else {
        return reply.internalServerError();
    }
  } catch (error) {
    return error;
  }
};

export const updatePost = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: FromSchema<typeof EditPostValidate>;
  }>,

  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const postToFind = await Post.findById(id);
      if (!postToFind) {
          return reply.notFound("Post was not found");
    } else {
      const token = request.headers.authorization?.replace("Bearer ", "");
      const ID = jwtDecode<JwtPayload>(token ?? "").sub;
      const creator = postToFind?.creator.valueOf();
          if (creator !== ID) {
              return reply.unavailableForLegalReasons();
          } else {
        const { title, content, category, tags } = request.body;

        return await Post.findByIdAndUpdate(
          id,
          { title, content, category, tags },
          { new: true }
        ).exec();
      }
    }
  } catch (error) {
    return error;
  }
};

export const deletePost = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const postToFind = await Post.findById(id).exec();
      if (!postToFind) {
          return reply.notFound("Post was not found");
    } else {
      const token = request.headers.authorization?.replace("Bearer ", "");
      const ID = jwtDecode<JwtPayload>(token ?? "").sub;
      const creator = postToFind?.creator.valueOf();
          if (creator !== ID) {
              return reply.unavailableForLegalReasons();
      }
      return await Post.findByIdAndDelete(id).exec();
    }
  } catch (error) {
    return error;
  }
};
