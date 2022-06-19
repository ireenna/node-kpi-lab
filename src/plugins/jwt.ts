import fp from 'fastify-plugin'
import { FastifyRequest, FastifyReply } from 'fastify';
import fjwt, { FastifyJWTOptions } from '@fastify/jwt'
import {User} from '../config/models/user';
import { hash,compare } from 'bcrypt';


export default fp<FastifyJWTOptions>(async (fastify, opts) => {

    fastify.register(fjwt as any, {
        secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6ImFkbWluMTIzIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.KZ0N2KenTfDygGEN7a0_7sgF7-ZOZa8YMyLbSPgrSoY',
        decode: {
            checkTyp: 'JWT'
        },
        sign: {
            algorithm: 'HS256'
        }
    })

    fastify.decorate('jwtauthenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.code(401).send(error);
        }
    })

    fastify.decorate('sendTokens', async (request: FastifyRequest<{
        Body: {
            email: string;
            password: string;
        }
    }>,

        reply: FastifyReply) => {
        try {
            const { email, password } = request.body;
            const user = await User.findOne({ email });
            //var result = await compare(user.password, password);
            if (!user) {
                reply.code(400).send('Invalid email');
            } else if (!user.validatePassword(password)) {
                reply.code(400).send('Invalid email or password');
            }

            const payload = {
                sub: user!._id,
                name: user!.name,
                email: user!.email,
                avatar: user!.avatar,
                isAdmin: user!.isAdmin,
                isMember: user!.isMember,
                last_login: user!.lastLogin,
                token_version: user!.tokenVersion
            };
            return { access_token: fastify.jwt.sign(payload, fastify.jwt.options.sign) };
        } catch (error) {
            console.error(error);
            reply.send(error);
        }
    })
    fastify.decorate('registr', async (request: FastifyRequest<{
        Body: {
            email: string;
            password: string;
            name: string;
            avatar: string;
            isAdmin: boolean;
            isMember: boolean;
        }
    }>,

        reply: FastifyReply) => {
        try {
            const { password, email, name, avatar, isMember, isAdmin } = request.body;
            if (!(email && password && name)) {
                reply.status(400).send("All input is required");
            }
            const oldUser = await User.findOne({ email: email });
            if (oldUser) {
                return reply.status(409).send("User Already Exist. Please Login");
            }
            const user = await User.create({
                name,
                email: email.toLowerCase(),
                avatar,
                isMember,
                isAdmin,
                password: await hash(password,10)
            });
            const token = fastify.jwt.sign(
                { user_id: user._id, email },
                fastify.jwt.options.sign
            );
            return { access_token: token };
        } catch (error) {
            console.error(error);
            reply.send(error);
        }
    })
})

declare module 'fastify' {
    export interface FastifyInstance {
        jwtauthenticate: any
        sendTokens: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        registr: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}