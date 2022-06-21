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
const fastify_plugin_1 = __importDefault(require('fastify-plugin'))
const jwt_1 = __importDefault(require('@fastify/jwt'))
const user_1 = require('../config/models/user')
exports.default = (0, fastify_plugin_1.default)((fastify, opts) =>
  __awaiter(void 0, void 0, void 0, function * () {
    fastify.register(jwt_1.default, {
      secret:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6ImFkbWluMTIzIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.KZ0N2KenTfDygGEN7a0_7sgF7-ZOZa8YMyLbSPgrSoY',
      decode: {
        checkTyp: 'JWT'
      },
      sign: {
        algorithm: 'HS256'
      }
    })
    fastify.decorate('jwtauthenticate', (request, reply) =>
      __awaiter(void 0, void 0, void 0, function * () {
        try {
          yield request.jwtVerify()
        } catch (error) {
          reply.code(401).send(error)
        }
      })
    )
    fastify.decorate('sendTokens', (request, reply) =>
      __awaiter(void 0, void 0, void 0, function * () {
        try {
          const { email, password } = request.body
          const user = yield user_1.User.findOne({ email }).exec()
          if (!user) {
            reply.code(400)
            return 'Invalid email'
          }
          const isCorrectPassword = yield user.validatePassword(password)
          if (!isCorrectPassword) {
            reply.code(400)
            return 'Invalid email or password'
          }
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
          console.error(error)
          reply.send(error)
        }
      })
    )
    fastify.decorate('registr', (request, reply) =>
      __awaiter(void 0, void 0, void 0, function * () {
        try {
          const { password, email, name, avatar, isAdmin } = request.body
          const oldUser = yield user_1.User.findOne({ email })
          if (oldUser) {
            return reply.status(409).send('User Already Exist. Please Login')
          }
          const user = yield user_1.User.create({
            name,
            email: email.toLowerCase(),
            avatar,
            isAdmin,
            password
          })
          const payload = {
            sub: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            last_login: user.lastLogin,
            token_version: user.tokenVersion
          }
          const token = fastify.jwt.sign(payload, fastify.jwt.options.sign)
          return { access_token: token }
        } catch (error) {
          console.error(error)
          reply.send(error)
        }
      })
    )
  })
)
