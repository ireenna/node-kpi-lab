import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import fp from "fastify-plugin";
import got from "got";

const API_KEY = process.env.API_KEY;
const films: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.get("/films", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as Object;
      let name = "";

      Object.entries(query).find(([key, value]) => {
        if (key === "name") {
          name = value;
          return true;
        }
      });
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${name}&page=1&include_adult=false`;
        const response = await got(url);
      return reply.code(200).send(response.body);
    } catch (error) {
      request.log.error(error);
      return reply.code(400).send(error);
    }
  });
};

export default fp(films);
