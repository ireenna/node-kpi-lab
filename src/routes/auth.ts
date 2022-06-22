import { FastifyPluginAsync, FastifyPluginOptions, FastifyInstance } from 'fastify'
import {
  LoginUserValidate,
  RegisterUserValidate
} from '../validators/auth.validators'

export const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/login', LoginUserValidate, fastify.sendTokens)
  fastify.post('/register', RegisterUserValidate, fastify.registr)
}

export default auth
