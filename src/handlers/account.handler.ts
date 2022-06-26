import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../config/models/user";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {
    EditAccountValidate
} from "../validators/auth.validators";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from 'http-errors-enhanced'

export const getCurrentAccount = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    const ID = jwtDecode<JwtPayload>(token ?? "").sub;
    const currentUser = await User.findById(ID).exec();
      if (!currentUser) {
          const error = new BadRequestError();
          error.id = 400;
          throw error;
      }
      return currentUser;
  } catch (error) {
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
        const error = new BadRequestError();
        error.id = 400;
        throw error;
    }
    return user;
  } catch (error) {
    return error;
  }
};
