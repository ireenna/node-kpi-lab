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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtPlugin = (fastify, opts, done) => {
    fastify.decorate('signAccessToken', (payload, time) => __awaiter(void 0, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign(payload, fastify.appConfig.jwt.accessSecret, {
            expiresIn: time,
        });
    }));
    fastify.decorate('signRefreshToken', (payload, time) => __awaiter(void 0, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign(payload, fastify.appConfig.jwt.refreshSecret, {
            expiresIn: time,
        });
    }));
    fastify.decorate('verifyAccessToken', (token) => {
        return jsonwebtoken_1.default.verify(token, fastify.appConfig.jwt.accessSecret);
    });
    fastify.decorate('verifyRefreshToken', (token) => {
        return jsonwebtoken_1.default.verify(token, fastify.appConfig.jwt.refreshSecret);
    });
    fastify.decorate('isAdmin', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = request["headers"]['authorization'];
            if (authHeader && (yield fastify.verifyAccessToken(authHeader.replace('Barear', '').trim()))) {
                return true;
            }
            else
                throw new Error();
        }
        catch (e) {
            reply.code(403).send();
        }
    }));
    done();
};
exports.default = (0, fastify_plugin_1.default)(jwtPlugin, {
    fastify: '3.x',
    name: 'jwt-auth',
});
