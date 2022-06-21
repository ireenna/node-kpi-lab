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
const fastify_1 = require('fastify')
const db_1 = __importDefault(require('./config/db'))
const autoload_1 = __importDefault(require('@fastify/autoload'))
const path_1 = require('path')
const cors_1 = __importDefault(require('@fastify/cors'))
const pino = require('pino')
const Port = process.env.PORT || 3000
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogs'
const server = (0, fastify_1.fastify)({
  logger: pino({ level: 'info' })
})
// register plugin below:
server.register(db_1.default, { uri })
server.register(cors_1.default, {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3000']
    if (allowedOrigins.includes(origin) || !origin) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
})
void server.register(autoload_1.default, {
  dir: (0, path_1.join)(__dirname, 'plugins')
})
void server.register(autoload_1.default, {
  dir: (0, path_1.join)(__dirname, 'routes')
})
const start = () =>
  __awaiter(void 0, void 0, void 0, function * () {
    try {
      yield server.listen(Port)
      console.log('Server started successfully')
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  })
start()
