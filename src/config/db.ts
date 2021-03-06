import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import mongoose, { Models } from "mongoose";
import { User } from "./models/user";
import { Posts } from "./models/posts";

interface AppModuleConfig {
  uri: string;
}

const ConnectDB: FastifyPluginAsync<AppModuleConfig> = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  try {
    mongoose.connection.on("connected", () => {
      fastify.log.info("MongoDB is connected");
    });

    mongoose.connection.on("disconnected", () => {
      fastify.log.error("MongoDB is disconnected");
    });

    await mongoose.connect(options.uri, {});

    const models: Models = { Posts, User };

    fastify.decorate("db", { models });
  } catch (error) {
    console.error(error);
  }
};

export default ConnectDB;
