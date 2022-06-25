import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyInstance,
} from "fastify";
import {
  LoginUserValidate,
  RegisterUserValidate,
} from "../validators/auth.validators";
import fp from "fastify-plugin";


export const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post("/login", LoginUserValidate, fastify.sendTokens);
  fastify.post("/register", RegisterUserValidate, fastify.registr);
};

export default fp(auth);
