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
const got_1 = __importDefault(require('got'))
const UserRoute = (server, options) =>
  __awaiter(void 0, void 0, void 0, function * () {
    server.get('/films', (request, reply) =>
      __awaiter(void 0, void 0, void 0, function * () {
        try {
          const query = request.query
          let name = ''
          Object.entries(query).find(([key, value]) => {
            if (key === 'name') {
              name = value
              return true
            }
          })
          const url = `https://api.themoviedb.org/3/search/movie?api_key=a769c1d1893614012adddf3f9aaa8f76&language=en-US&query=${name}&page=1&include_adult=false`
          const response = yield (0, got_1.default)(url)
          console.log(response.body)
          return reply.code(200).send(response.body)
        } catch (error) {
          request.log.error(error)
          return reply.code(400).send(error)
        }
      })
    )
  })
exports.default = (0, fastify_plugin_1.default)(UserRoute)
