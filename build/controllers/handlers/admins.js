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
exports.loginAdminHandler = exports.registerAdminHandler = exports.getAdminsHandler = void 0;
const admins_1 = require("../../cloud/admins");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAdminsHandler = (req, reply) => {
    reply.send(admins_1.admins);
};
exports.getAdminsHandler = getAdminsHandler;
const registerAdminHandler = (req, reply) => {
    const { username, email, password } = req.body;
    const id = admins_1.admins.length + 1;
    admins_1.admins.push({
        id,
        username,
        email,
        password
    });
    reply.send('Account created successfully');
};
exports.registerAdminHandler = registerAdminHandler;
const loginAdminHandler = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const admin = yield getName(); // assumming we used mongodb
        if (!admin) {
            return reply.send("This admin doesn't exist");
        }
        // check if password is correct
        //if (password !== admin.password) {
        //  return reply.send('Invalid credentials');
        //}
        // sign a token
        jsonwebtoken_1.default.sign({ id: admin }, 'my_jwt_secret', { expiresIn: 3 * 86400 }, (err, token) => {
            if (err)
                throw err;
            reply.send({ token });
        });
        yield reply;
    }
    catch (err) {
        console.log(err);
        reply.status(500).send('Server error');
    }
});
exports.loginAdminHandler = loginAdminHandler;
function getName() {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
