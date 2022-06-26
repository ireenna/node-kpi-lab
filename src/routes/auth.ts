import { FastifyPluginAsync } from "fastify";
import {
  LoginUserValidate,
  RegisterUserValidate,
} from "../validators/auth.validators";
import fp from "fastify-plugin";

export const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    "/login",
    { schema: { body: LoginUserValidate } },
    fastify.sendTokens
  );
  fastify.post(
    "/register",
    { schema: { body: RegisterUserValidate } },
    fastify.registr
  );
};

export default fp(auth);
