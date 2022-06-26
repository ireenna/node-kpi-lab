import db from "./config/db";
import AutoLoad from "@fastify/autoload";
import { join } from "path";
import winston from "winston";
require("dotenv").config();
import fastifySensible from "@fastify/sensible";

const port = process.env.PORT || 3000;
const uri = process.env.MongoDB || "mongodb://localhost:27017/blogs";

const logger = winston.createLogger({
  // Define levels required by Fastify (by default winston has verbose level and does not have trace)
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.timestamp({ format: "isoDateTime" })
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
    new winston.transports.File({
      filename: "api.log",
      dirname: "logs/info",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: "error",
      filename: "errors.log",
      dirname: "logs/error",
      format: winston.format.json(),
    }),
  ],
});
const server = require("fastify")({ logger });
server.register(fastifySensible);
server.register(db, { uri });
server.register(AutoLoad, {
  dir: join(__dirname, "plugins"),
});

server.register(AutoLoad, {
  dir: join(__dirname, "routes"),
});
const start = async () => {
  try {
    await server.listen(port);
    console.log("Server started successfully");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
