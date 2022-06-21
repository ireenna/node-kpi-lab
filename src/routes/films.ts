import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply
} from 'fastify'
import fp from 'fastify-plugin'
import got from 'got'
import { Db } from '../config/db'

import querystring from 'querystring'

// Declaration merging
declare module 'fastify' {
  export interface FastifyInstance {
    db: Db;
  }
}

const UserRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.get('/films', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as Object
      let name = ''

      Object.entries(query).find(([key, value]) => {
        if (key === 'name') {
          name = value
          return true
        }
      })
      const url = `https://api.themoviedb.org/3/search/movie?api_key=a769c1d1893614012adddf3f9aaa8f76&language=en-US&query=${name}&page=1&include_adult=false`
      const response = await got(url)
      console.log(response.body)
      return reply.code(200).send(response.body)
    } catch (error) {
      request.log.error(error)
      return reply.code(400).send(error)
    }
  })
}

export default fp(UserRoute)
