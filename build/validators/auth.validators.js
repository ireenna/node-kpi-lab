"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserValidate = exports.LoginUserValidate = void 0;
exports.LoginUserValidate = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
            },
            required: ['email', 'password']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    access_token: { type: 'string' }
                }
            }
        }
    }
};
exports.RegisterUserValidate = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string', default: '' },
                isAdmin: { type: 'boolean', default: true },
                isMember: { type: 'boolean', default: true }
            },
            required: ['email', 'password', 'name']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    access_token: { type: 'string' }
                }
            }
        }
    }
};
