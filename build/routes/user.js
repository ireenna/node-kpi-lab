'use strict'
const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt (value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
          resolve(value)
        })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled (value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected (value) {
        try {
          step(generator.throw(value))
        } catch (e) {
          reject(e)
        }
      }
      function step (result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
const users_handler_1 = require('../handlers/users.handler')
const user_1 = require('../config/models/user')
const auth_validators_1 = require('../validators/auth.validators')
const users = (fastify, opts) =>
  __awaiter(void 0, void 0, void 0, function * () {
    fastify.put(
      '/users/:id/change-password',
      { onRequest: [fastify.jwtauthenticate, users_handler_1.isAdmin] },
      (request, reply) =>
        __awaiter(void 0, void 0, void 0, function * () {
          const { id } = request.params
          const { newPassword } = request.body
          const userToFind = yield user_1.User.findById(id)
          if (userToFind && userToFind.isAdmin) {
            reply.code(400)
            return 'You are not allowed to change password of other admins'
          }
          if (!userToFind) {
            reply.code(404)
            return 'User was not found'
          }
          const user = yield user_1.User.findByIdAndUpdate(
            id,
            { password: newPassword },
            { new: true }
          ).exec()
          const payload = {
            sub: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            last_login: user.lastLogin,
            token_version: user.tokenVersion
          }
          return {
            access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign)
          }
        })
    )
    fastify.get(
      '/users',
      { onRequest: [fastify.jwtauthenticate, users_handler_1.isAdmin] },
      users_handler_1.getAllUsers
    )
    fastify.get(
      '/users/:id',
      { onRequest: [fastify.jwtauthenticate, users_handler_1.isAdmin] },
      users_handler_1.getUserById
    )
    fastify.put(
      '/users/:id',
      {
        onRequest: [fastify.jwtauthenticate, users_handler_1.isAdmin],
        schema: { body: auth_validators_1.EditUserValidate }
      },
      users_handler_1.updateUser
    )
    fastify.delete(
      '/users/:id',
      { onRequest: [fastify.jwtauthenticate, users_handler_1.isAdmin] },
      users_handler_1.deleteUser
    )
  })
exports.default = users
