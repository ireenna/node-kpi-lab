import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User } from "../config/models/user";
// import * as JWT from 'jwt-decode';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { IUser } from "../config/interfaces/user";
import { FromSchema } from "json-schema-to-ts";
import { EditUserValidate } from "../validators/auth.validators";

export const getAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    return await User.find({}).exec();
  } catch (error) {
    console.error(error);
    reply.send(error);
  }
};

export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    const isAdmin = jwtDecode<IUser>(token ?? "").isAdmin;
    if (!isAdmin) {
      reply.code(401).send("Current user doesn't have an access");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await User.findById(request.params.id).exec();
    if (!user) reply.code(404).send("User was not found");
    return user;
  } catch (error) {
    console.error(error);
    reply.send(error);
  }
};

export const updateUser = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: FromSchema<typeof EditUserValidate>;
  }>,

  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { name, email, avatar, isAdmin } = request.body;
    const userToFind = await User.findById(id).exec();
    if (userToFind && userToFind.isAdmin) {
      reply.code(400);
      return "You are not allowed to edit admins";
    }
    const userToUpdate = await User.findByIdAndUpdate(
      id,
      { name, email, avatar, isAdmin },
      { new: true }
    ).exec();
    if (!userToUpdate) {
      reply.code(404);
      return "User was not found";
    }
    return userToUpdate;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const deleteUser = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const userToFind = await User.findById(id).exec();
    if (userToFind && userToFind.isAdmin) {
      reply.code(400);
      return "You are not allowed to delete admins";
    }
    const userToDelete = await User.findByIdAndDelete(id).exec();
    if (!userToDelete) {
      reply.code(404);
      return "User was not found";
    }
    return userToDelete;
  } catch (error) {
    console.error(error);
    return error;
  }
};
