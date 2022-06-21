import fp from 'fastify-plugin'
import { FastifyRequest, FastifyReply } from 'fastify'
import fjwt, { FastifyJWTOptions } from '@fastify/jwt'
import { User } from '../config/models/user'
import { hash, compare } from 'bcrypt'

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fjwt as any, {
    secret:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6ImFkbWluMTIzIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.KZ0N2KenTfDygGEN7a0_7sgF7-ZOZa8YMyLbSPgrSoY',
    decode: {
      checkTyp: 'JWT'
    },
    sign: {
      algorithm: 'HS256'
    }
  })

  fastify.decorate(
    'jwtauthenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (error) {
        reply.code(401).send(error)
      }
    }
  )

  fastify.decorate(
    'sendTokens',
    async (
      request: FastifyRequest<{
        Body: {
          email: string;
          password: string;
        };
      }>,

      reply: FastifyReply
    ) => {
      try {
        const { email, password } = request.body
        const user = await User.findOne({ email }).exec()
        if (!user) {
          reply.code(400)
          return 'Invalid email'
        }

        const isCorrectPassword = await user.validatePassword(password)
        if (!isCorrectPassword) {
          reply.code(400)
          return 'Invalid email or password'
        }

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
        console.error(error)
        reply.send(error)
      }
    }
  )
  fastify.decorate(
    'registr',
    async (
      request: FastifyRequest<{
        Body: {
          email: string;
          password: string;
          name: string;
          avatar: string;
          isAdmin: boolean;
        };
      }>,

      reply: FastifyReply
    ) => {
      try {
        const { password, email, name, avatar, isAdmin } = request.body
        const oldUser = await User.findOne({ email })
        if (oldUser) {
          return reply.status(409).send('User Already Exist. Please Login')
        }
        const user = await User.create({
          name,
          email: email.toLowerCase(),
          avatar,
          isAdmin,
          password
        })
        const payload = {
          sub: user!._id,
          name: user!.name,
          email: user!.email,
          avatar: user!.avatar,
          isAdmin: user!.isAdmin,
          last_login: user!.lastLogin,
          token_version: user!.tokenVersion
        }
        const token = fastify.jwt.sign(payload, fastify.jwt.options.sign)
        return { access_token: token }
      } catch (error) {
        console.error(error)
        reply.send(error)
      }
    }
  )
})

declare module 'fastify' {
  export interface FastifyInstance {
    jwtauthenticate: any;
    sendTokens: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    registr: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
