import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
  FastifyInstance
} from 'fastify'

import { User } from '../config/models/user'
import { hash, compare } from 'bcrypt'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import {
  EditAccountValidate,
  ChangeAccountPassword
} from '../validators/auth.validators'

const accounts: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    '/account',
    { onRequest: [fastify.jwtauthenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.headers.authorization?.replace('Bearer ', '')
        const ID = jwtDecode<JwtPayload>(token ?? '').sub
        if (!ID) {
          reply.code(401)
          return 'Token is not valid. Please, relogin.'
        }
        const currentUser = await User.findById(ID).exec()
        if (!currentUser) {
          reply.code(401)
          return 'Current user is not valid. Please, relogin.'
        }
        return await User.findById(ID).exec()
      } catch (error) {
        console.log(error)
        reply.code(500)
        return error
      }
    }
  )
  fastify.put(
    '/account/change-password',
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: ChangeAccountPassword }
    },
    async (
      request: FastifyRequest<{
        Body: {
          oldPassword: string;
          newPassword: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { oldPassword, newPassword } = request.body
        const token = request.headers.authorization?.replace('Bearer ', '')
        const ID = jwtDecode<JwtPayload>(token ?? '').sub
        if (!ID) {
          reply.code(401)
          return 'Token is not valid. Please, relogin.'
        }

        const currentUser = await User.findById(ID).exec()
        if (!currentUser) {
          reply.code(401)
          return 'Current user is not valid. Please, relogin.'
        }
        const isValidPW = await currentUser.validatePassword(oldPassword)
        if (!isValidPW) {
          reply.code(400)
          return 'Old password is wrong'
        }
        const user = await User.findByIdAndUpdate(
          ID,
          { password: await hash(newPassword, 10) },
          { new: true }
        ).exec()

        const payload = {
          sub: user!._id,
          name: user!.name,
          email: user!.email,
          avatar: user!.avatar,
          isAdmin: user!.isAdmin,
          last_login: user!.lastLogin,
          token_version: user!.tokenVersion
        }
        return {
          access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign)
        }
      } catch (error) {
        console.log(error)
        reply.code(500)
        return error
      }
    }
  )
  fastify.put(
    '/account',
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: EditAccountValidate }
    },
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          email: string;
          avatar: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { name, email, avatar } = request.body
        const token = request.headers.authorization?.replace('Bearer ', '')
        const ID = jwtDecode<JwtPayload>(token ?? '').sub
        if (!ID) {
          reply.code(401)
          return 'Token is not valid. Please, relogin.'
        }
        const user = await User.findByIdAndUpdate(
          ID,
          { name, email, avatar },
          { new: true }
        ).exec()
        if (!user) {
          reply.code(401)
          return 'Current user is not valid. Please, relogin.'
        }
        return user
      } catch (error) {
        console.log(error)
        reply.code(500)
        return error
      }
    }
  )
}
export default accounts
