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
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const user_1 = require('../config/models/user')
const bcrypt_1 = require('bcrypt')
const jwt_decode_1 = __importDefault(require('jwt-decode'))
const auth_validators_1 = require('../validators/auth.validators')
const auth_validators_2 = require('../validators/auth.validators')
const accounts = (fastify, opts) =>
  __awaiter(void 0, void 0, void 0, function * () {
    fastify.get(
      '/account',
      { onRequest: [fastify.jwtauthenticate] },
      (request, reply) =>
        __awaiter(void 0, void 0, void 0, function * () {
          let _a
          try {
            const token =
              (_a = request.headers.authorization) === null || _a === void 0
                ? void 0
                : _a.replace('Bearer ', '')
            const ID = (0, jwt_decode_1.default)(
              token !== null && token !== void 0 ? token : ''
            ).sub
            if (!ID) {
              reply.code(401)
              return 'Token is not valid. Please, relogin.'
            }
            const currentUser = yield user_1.User.findById(ID).exec()
            if (!currentUser) {
              reply.code(401)
              return 'Current user is not valid. Please, relogin.'
            }
            return yield user_1.User.findById(ID).exec()
          } catch (error) {
            console.log(error)
            reply.code(500)
            return error
          }
        })
    )
    fastify.put(
      '/account/change-password',
      {
        onRequest: [fastify.jwtauthenticate],
        schema: { body: auth_validators_2.ChangeAccountPassword }
      },
      (request, reply) =>
        __awaiter(void 0, void 0, void 0, function * () {
          let _b
          try {
            const { oldPassword, newPassword } = request.body
            const token =
              (_b = request.headers.authorization) === null || _b === void 0
                ? void 0
                : _b.replace('Bearer ', '')
            const ID = (0, jwt_decode_1.default)(
              token !== null && token !== void 0 ? token : ''
            ).sub
            if (!ID) {
              reply.code(401)
              return 'Token is not valid. Please, relogin.'
            }
            const currentUser = yield user_1.User.findById(ID).exec()
            if (!currentUser) {
              reply.code(401)
              return 'Current user is not valid. Please, relogin.'
            }
            const isValidPW = yield currentUser.validatePassword(oldPassword)
            if (!isValidPW) {
              reply.code(400)
              return 'Old password is wrong'
            }
            const user = yield user_1.User.findByIdAndUpdate(
              ID,
              { password: yield (0, bcrypt_1.hash)(newPassword, 10) },
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
          } catch (error) {
            console.log(error)
            reply.code(500)
            return error
          }
        })
    )
    fastify.put(
      '/account',
      {
        onRequest: [fastify.jwtauthenticate],
        schema: { body: auth_validators_1.EditAccountValidate }
      },
      (request, reply) =>
        __awaiter(void 0, void 0, void 0, function * () {
          let _c
          try {
            const { name, email, avatar } = request.body
            const token =
              (_c = request.headers.authorization) === null || _c === void 0
                ? void 0
                : _c.replace('Bearer ', '')
            const ID = (0, jwt_decode_1.default)(
              token !== null && token !== void 0 ? token : ''
            ).sub
            if (!ID) {
              reply.code(401)
              return 'Token is not valid. Please, relogin.'
            }
            const user = yield user_1.User.findByIdAndUpdate(
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
        })
    )
  })
exports.default = accounts
