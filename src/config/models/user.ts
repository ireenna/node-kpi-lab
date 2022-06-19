import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user';
import { IValidate, IVerify } from '../interfaces/auth';
import { compare,compareSync, hash } from 'bcrypt';

export const validateEmail = function (email: string) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        immutable: true,
        validate: [validateEmail, 'Please, write valid email.']
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isMember: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        code: {
            type: String,
            default: ''
        },
        expiresBy: {
            type: Date,
            default: ''
        }
    },
    refreshToken: {
        token: {
            type: String,
            default: ''
        },
        expiresBy: {
            type: Date,
            default: ''
        }
    },
    tokenVersion: {
        type: Number,
        default: 0
    }
    //posts: [{type:Schema.Types.ObjectId, ref:'Posts'}]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOne', async function (next) {
    await this.model.findOneAndUpdate(this.getFilter().email, { '$set': { 'lastLogin': Date.now() } }, { new: true });
    next();
});

// UserSchema.methods.generateCode = async function (): Promise<string | null> {
//     const code = await generateRandomCode(3);
//     this.resetPassword.code = await hash(code!, 10);
//     this.resetPassword.expiresBy = new Date(Date.now() + 300000);
//     this.save();
//     return code;
// };

UserSchema.methods.verifyCode = async function (code: string | Buffer): Promise<IVerify> {
    const validCode = compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};

// UserSchema.methods.generateTokens = async function (usr: IUser): Promise<ITokens> {
//     const { token, refresh_token } = await tokenGenerator(usr);
//     this.refreshToken.token = refresh_token;
//     const decodedJwt: JwtPayload = decode(refresh_token) as JwtPayload;
//     this.refreshToken.expiresBy = new Date(decodedJwt.exp! * 1000);
//     this.tokenVersion++;
//     this.lastLogin = new Date(Date.now());
//     await this.save();
//     return { token, refresh_token };
// }

UserSchema.methods.validateRefreshToken = async function (token: any): Promise<IValidate> {
    const validToken = this.refreshToken.token === token;
    const refreshTokenNotExpired = (new Date(this.resetPassword.expiresBy).getTime() - Date.now()) < 604800000;
    const tokenVersionValid = (this.tokenVersion - token.token_version) === 1;
    return { validToken, refreshTokenNotExpired, tokenVersionValid };
}

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    //console.log(password);
    //console.log(this.password);
    //console.log(compare(password, this.password));
    return compareSync(password, this.password);
};

export const User = model<IUser>('User', UserSchema);