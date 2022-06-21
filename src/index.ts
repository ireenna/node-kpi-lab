import { fastify } from 'fastify'
import db from './config/db'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { join } from 'path'
import cors from '@fastify/cors'
import { bootstrap } from 'fastify-decorators'
const pino = require('pino')
const Port = process.env.PORT || 3000
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogs'

const server = fastify({
  logger: pino({ level: 'info' })
})

// register plugin below:
server.register(db, { uri })
server.register(cors, {
  origin: (origin: string, cb: any) => {
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

server.register(AutoLoad, {
  dir: join(__dirname, 'plugins')
})

server.register(AutoLoad, {
  dir: join(__dirname, 'routes')
})

const start = async () => {
  try {
    await server.listen(Port)
    console.log('Server started successfully')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
