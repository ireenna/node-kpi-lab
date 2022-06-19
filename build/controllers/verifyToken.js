"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, reply, done) => {
    const { token } = req.headers;
    jsonwebtoken_1.default.verify(token, 'my_jwt_secret', (err, decoded) => {
        if (err) {
            done(new Error('Unauthorized'));
        }
        req.user = {
            id: decoded.id, // pass in the user's info
        };
    });
    done();
};
exports.verifyToken = verifyToken;
