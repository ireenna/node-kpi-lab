import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
  FastifyInstance
} from 'fastify'
import {
  isAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../handlers/users.handler'

import { User } from '../config/models/user'
import { hash, compare } from 'bcrypt'
import { EditUserValidate } from '../validators/auth.validators'

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.put(
    '/users/:id/change-password',
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          newPassword: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params
      const { newPassword } = request.body
      const userToFind = await User.findById(id)
      if (userToFind && userToFind.isAdmin) {
        reply.code(400)
        return 'You are not allowed to change password of other admins'
      }
      if (!userToFind) {
        reply.code(404)
        return 'User was not found'
      }
      const user = await User.findByIdAndUpdate(
        id,
        { password: newPassword },
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
    }
  )

  fastify.get(
    '/users',
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    getAllUsers
  )

  fastify.get(
    '/users/:id',
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    getUserById
  )

  fastify.put(
    '/users/:id',
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { body: EditUserValidate }
    },
    updateUser
  )

  fastify.delete(
    '/users/:id',
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    deleteUser
  )
}

export default users
