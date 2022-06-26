import fp from "fastify-plugin";
import { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { FastifyJWTOptions } from "@fastify/jwt";
import { User } from "../config/models/user";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { hash } from "bcrypt";
import {
  LoginUserValidate,
  RegisterUserValidate,
  ChangeAccountPassword,
  ChangePasswordForUser,
} from "../validators/auth.validators";
import { FromSchema } from "json-schema-to-ts";

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fjwt as any, {
    secret: process.env.JWT,
    decode: {
      checkTyp: "JWT",
    },
    sign: {
      algorithm: "HS256",
      expiresIn: "12h",
    },
  });

  fastify.decorate(
    "jwtauthenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.code(401).send(error);
      }
    }
  );

  fastify.decorate(
    "sendTokens",
    async (
      request: FastifyRequest<{
        Body: FromSchema<typeof LoginUserValidate>;
      }>,

      reply: FastifyReply
    ) => {
      try {
        const { email, password } = request.body;
        const user = await User.findOne({ email }).exec();
        if (!user) {
          reply.code(400);
          return "Invalid email or password";
        }

        const isCorrectPassword = await user.validatePassword(password);
        if (!isCorrectPassword) {
          reply.code(400);
          return "Invalid email or password";
        }

        const payload = {
          sub: user!._id,
          name: user!.name,
          email: user!.email,
          isAdmin: user!.isAdmin,
        };
        return {
          access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign),
        };
      } catch (error) {
        console.error(error);
        reply.send(error);
      }
    }
  );
  fastify.decorate(
    "registr",
    async (
      request: FastifyRequest<{
        Body: FromSchema<typeof RegisterUserValidate>;
      }>,

      reply: FastifyReply
    ) => {
      try {
        const { password, email, name, avatar, isAdmin } = request.body;
        const oldUser = await User.findOne({ email }).exec();
        if (oldUser) {
          return reply.status(409).send("User Already Exist. Please Login");
        }
        const user = await User.create({
          name,
          email: email.toLowerCase(),
          avatar,
          isAdmin,
          hashPassword: password,
        });
        const payload = {
          sub: user!._id,
          name: user!.name,
          email: user!.email,
          isAdmin: user!.isAdmin,
        };
        const token = fastify.jwt.sign(payload, fastify.jwt.options.sign);
        return { access_token: token };
      } catch (error) {
        console.error(error);
        reply.send(error);
      }
    }
  );
  fastify.decorate(
    "changePassword",
    async (
      request: FastifyRequest<{
        Body: FromSchema<typeof ChangeAccountPassword>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { oldPassword, newPassword } = request.body;
        const token = request.headers.authorization?.replace("Bearer ", "");
        const ID = jwtDecode<JwtPayload>(token ?? "").sub;
        const currentUser = await User.findById(ID).exec();
        if (!currentUser) {
          reply.code(401);
          return "Current user is not valid. Please, relogin.";
        }
        const isValidPW = await currentUser.validatePassword(oldPassword);
        if (!isValidPW) {
          reply.code(400);
          return "Old password is wrong";
        }
        const user = await User.findByIdAndUpdate(
          ID,
          { hashPassword: await hash(newPassword, 10) },
          { new: true }
        ).exec();

        const payload = {
          sub: user!._id,
          name: user!.name,
          email: user!.email,
          isAdmin: user!.isAdmin,
        };
        return {
          access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign),
        };
      } catch (error) {
        console.log(error);
        reply.code(500);
        return error;
      }
    }
  );
  fastify.decorate(
    "changePasswordForUser",
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: FromSchema<typeof ChangePasswordForUser>;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { newPassword } = request.body;
      const userToFind = await User.findById(id);
      if (userToFind && userToFind.isAdmin) {
        reply.code(400);
        return "You are not allowed to change password of admins";
      }
      if (!userToFind) {
        reply.code(404);
        return "User was not found";
      }
      const user = await User.findByIdAndUpdate(
        id,
        { hashPassword: newPassword },
        { new: true }
      ).exec();

      const payload = {
        sub: user!._id,
        name: user!.name,
        email: user!.email,
        isAdmin: user!.isAdmin,
      };
      return {
        access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign),
      };
    }
  );
});

declare module "fastify" {
  export interface FastifyInstance {
    jwtauthenticate: any;
    sendTokens: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    registr: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    changePassword: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    changePasswordForUser: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
