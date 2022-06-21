import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { User } from '../config/models/user'
// import * as JWT from 'jwt-decode';
import jwtDecode, { JwtPayload } from 'jwt-decode'

export const getAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    return await User.find({}).exec()
  } catch (error) {
    console.error(error)
    reply.send(error)
  }
}

export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
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
    if (!currentUser.isAdmin) {
      reply.code(401).send("Current user doesn't have an access")
    }
  } catch (error) {
    console.error(error)
  }
}

export const getUserById = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await User.findById(request.params.id).exec()
    if (!user) reply.code(404).send('User was not found')
    return user
  } catch (error) {
    console.error(error)
    reply.send(error)
  }
}

export const updateUser = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: {
      name: string;
      email: string;
      avatar: string;
      isAdmin: boolean;
    };
  }>,

  reply: FastifyReply
) => {
  try {
    const { id } = request.params
    const { name, email, avatar, isAdmin } = request.body
    const userToFind = await User.findById(id)
    if (userToFind && userToFind.isAdmin) {
      reply.code(400)
      return 'You are not allowed to edit other admins'
    }
    const userToUpdate = await User.findByIdAndUpdate(
      id,
      { name, email, avatar, isAdmin },
      { new: true }
    ).exec()
    if (!userToUpdate) {
      reply.code(404)
      return 'User was not found'
    }
    return userToUpdate
  } catch (error) {
    console.error(error)
    return error
  }
}

export const deleteUser = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params
    const userToFind = await User.findById(id)
    if (userToFind && userToFind.isAdmin) {
      reply.code(400)
      return 'You are not allowed to delete other admins'
    }
    const userToDelete = await User.findByIdAndDelete(id).exec()
    if (!userToDelete) {
      reply.code(404)
      return 'User was not found'
    }
    return userToDelete
  } catch (error) {
    console.error(error)
    return error
  }
}
