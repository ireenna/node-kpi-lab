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
exports.deleteUser =
  exports.updateUser =
  exports.getUserById =
  exports.isAdmin =
  exports.getAllUsers =
    void 0
const user_1 = require('../config/models/user')
// import * as JWT from 'jwt-decode';
const jwt_decode_1 = __importDefault(require('jwt-decode'))
const getAllUsers = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      return yield user_1.User.find({}).exec()
    } catch (error) {
      console.error(error)
      reply.send(error)
    }
  })
exports.getAllUsers = getAllUsers
const isAdmin = (request, reply) =>
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
      if (!currentUser.isAdmin) {
        reply.code(401).send("Current user doesn't have an access")
      }
    } catch (error) {
      console.error(error)
    }
  })
exports.isAdmin = isAdmin
const getUserById = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      const user = yield user_1.User.findById(request.params.id).exec()
      if (!user) {
        reply.code(404).send('User was not found')
      }
      return user
    } catch (error) {
      console.error(error)
      reply.send(error)
    }
  })
exports.getUserById = getUserById
const updateUser = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      const { id } = request.params
      const { name, email, avatar, isAdmin } = request.body
      const userToFind = yield user_1.User.findById(id)
      if (userToFind && userToFind.isAdmin) {
        reply.code(400)
        return 'You are not allowed to edit other admins'
      }
      const userToUpdate = yield user_1.User.findByIdAndUpdate(
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
  })
exports.updateUser = updateUser
const deleteUser = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      const { id } = request.params
      const userToFind = yield user_1.User.findById(id)
      if (userToFind && userToFind.isAdmin) {
        reply.code(400)
        return 'You are not allowed to delete other admins'
      }
      const userToDelete = yield user_1.User.findByIdAndDelete(id).exec()
      if (!userToDelete) {
        reply.code(404)
        return 'User was not found'
      }
      return userToDelete
    } catch (error) {
      console.error(error)
      return error
    }
  })
exports.deleteUser = deleteUser
