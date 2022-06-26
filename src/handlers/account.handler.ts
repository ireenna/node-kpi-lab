import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../config/models/user";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { EditAccountValidate } from "../validators/auth.validators";
import { FromSchema } from "json-schema-to-ts";

export const getCurrentAccount = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    const ID = jwtDecode<JwtPayload>(token ?? "").sub;
    const currentUser = await User.findById(ID).exec();
    if (!currentUser) {
      reply.code(401);
      return "Current user is not valid.";
    }
    return currentUser;
  } catch (error) {
    console.log(error);
    reply.code(500);
    return error;
  }
};

export const UpdateAccount = async (
  request: FastifyRequest<{
    Body: FromSchema<typeof EditAccountValidate>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, avatar } = request.body;
    const token = request.headers.authorization?.replace("Bearer ", "");
    const ID = jwtDecode<JwtPayload>(token ?? "").sub;
    const user = await User.findByIdAndUpdate(
      ID,
      { name, email, avatar },
      { new: true }
    ).exec();
    if (!user) {
      reply.code(401);
      return "Current user is not valid.";
    }
    return user;
  } catch (error) {
    console.log(error);
    reply.code(500);
    return error;
  }
};
