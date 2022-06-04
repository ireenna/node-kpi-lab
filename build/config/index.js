"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogs_1 = require("./models/blogs");
const posts_1 = require("./models/posts");
const ConnectDB = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connection.on('connected', () => {
            fastify.log.info({ actor: 'MongoDB' }, 'connected');
        });
        mongoose_1.default.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
        });
        const db = yield mongoose_1.default.connect(options.uri, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useCreateIndex: true
        // these options are configurations options for mongoose to prevent mongoose throwing warnings and errors
        });
        const models = { Blog: blogs_1.Blog, Posts: posts_1.Posts };
        fastify.decorate('db', { models });
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = (0, fastify_plugin_1.default)(ConnectDB);
