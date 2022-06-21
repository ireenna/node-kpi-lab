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
const posts_handler_1 = require('../handlers/posts.handler')
const posts = (fastify, opts) =>
  __awaiter(void 0, void 0, void 0, function * () {
    fastify.get('/posts', posts_handler_1.getAllPosts)
    fastify.get('/posts/:id', posts_handler_1.getPostById)
    fastify.post(
      '/posts',
      { onRequest: [fastify.jwtauthenticate] },
      posts_handler_1.createPost
    )
    fastify.put(
      '/posts/:id',
      { onRequest: [fastify.jwtauthenticate] },
      posts_handler_1.updatePost
    )
    fastify.delete(
      '/posts/:id',
      { onRequest: [fastify.jwtauthenticate] },
      posts_handler_1.deletePost
    )
  })
exports.default = posts
