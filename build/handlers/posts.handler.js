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
exports.deletePost =
  exports.updatePost =
  exports.createPost =
  exports.getPostById =
  exports.getAllPosts =
    void 0
const posts_1 = require('../config/models/posts')
const user_1 = require('../config/models/user')
// import * as JWT from 'jwt-decode';
const jwt_decode_1 = __importDefault(require('jwt-decode'))
const getAllPosts = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      return yield posts_1.Posts.find({}).exec()
    } catch (error) {
      console.error(error)
      reply.send(error)
    }
  })
exports.getAllPosts = getAllPosts
const getPostById = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      const post = yield posts_1.Posts.findById(request.params.id).exec()
      if (!post) {
        reply.code(404).send('Post was not found')
      }
      return post
    } catch (error) {
      console.error(error)
      reply.send(error)
    }
  })
exports.getPostById = getPostById
const createPost = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    let _a
    try {
      const { title, content, category, tags } = request.body
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
      const post = yield posts_1.Posts.create({
        title,
        content,
        category,
        tags,
        creator: ID
      })
      const user = yield user_1.User.findByIdAndUpdate(ID, {
        $push: {
          posts: post
        }
      })
      return post
    } catch (error) {
      console.error(error)
      return error
    }
  })
exports.createPost = createPost
const updatePost = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    let _b
    try {
      const { id } = request.params
      const postToFind = yield posts_1.Posts.findById(id)
      if (!postToFind) {
        reply.code(404)
        return 'Post was not found'
      }
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
      const creator =
        postToFind === null || postToFind === void 0
          ? void 0
          : postToFind.creator.valueOf()
      if (creator !== ID) {
        reply.code(404)
        return 'This post is not available to edit for this user'
      }
      const { title, content, category, tags } = request.body
      return yield posts_1.Posts.findByIdAndUpdate(
        id,
        { title, content, category, tags },
        { new: true }
      ).exec()
    } catch (error) {
      console.error(error)
      return error
    }
  })
exports.updatePost = updatePost
const deletePost = (request, reply) =>
  __awaiter(void 0, void 0, void 0, function * () {
    let _c
    try {
      const { id } = request.params
      const postToFind = yield posts_1.Posts.findById(id)
      if (!postToFind) {
        reply.code(404)
        return 'Post was not found'
      }
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
      const creator =
        postToFind === null || postToFind === void 0
          ? void 0
          : postToFind.creator.valueOf()
      if (creator !== ID) {
        reply.code(404)
        return 'This post is not available to delete for this user'
      }
      return yield posts_1.Posts.findByIdAndDelete(id).exec()
    } catch (error) {
      console.error(error)
      return error
    }
  })
exports.deletePost = deletePost
