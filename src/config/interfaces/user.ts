import { FastifyRequest } from 'fastify';
import { Document } from 'mongoose';
import { ITokens, IValidate, IVerify } from './auth';

interface ResetPassword {
    code: string;
    expiresBy: Date;
}

interface RefreshToken {
    token: string;
    expiresBy: Date;
}

export interface IUser extends Document {
    _doc?: any;
    name: string;
    email: string;
    password: string;
    avatar: string;
    isAdmin: boolean;
    isMember: boolean;
    resetPassword: ResetPassword;
    refreshToken: RefreshToken;
    tokenVersion: number;
    lastLogin?: Date;
    generateCode: () => Promise<string>;
    generateTokens(usr: IUser): Promise<ITokens>;
    validatePassword(password: string): Promise<boolean>;
    validateRefreshToken(req: FastifyRequest): Promise<IValidate>;
    verifyCode: (code: string) => Promise<IVerify>;
}

export interface RequestWithUser extends FastifyRequest {
    user: IUser;
}