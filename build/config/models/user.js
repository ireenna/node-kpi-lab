'use strict'
const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt (value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
          resolve(value)
        })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled (value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected (value) {
        try {
          step(generator.throw(value))
        } catch (e) {
          reject(e)
        }
      }
      function step (result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.User = exports.validateEmail = void 0
const mongoose_1 = require('mongoose')
const bcrypt_1 = require('bcrypt')
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}
exports.validateEmail = validateEmail
const UserSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      immutable: true,
      validate: [exports.validateEmail, 'Please, write valid email.']
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
    },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Posts' }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)
UserSchema.pre('save', function (next) {
  return __awaiter(this, void 0, void 0, function * () {
    if (this.isNew || this.isModified('password')) {
      this.password = yield (0, bcrypt_1.hash)(this.password, 10)
    }
    next()
  })
})
UserSchema.pre('findOne', function (next) {
  return __awaiter(this, void 0, void 0, function * () {
    yield this.model.findOneAndUpdate(
      this.getFilter().email,
      { $set: { lastLogin: Date.now() } },
      { new: true }
    )
    next()
  })
})
UserSchema.methods.verifyCode = function (code) {
  return __awaiter(this, void 0, void 0, function * () {
    const validCode = (0, bcrypt_1.compare)(code, this.resetPassword.code)
    const codeNotExpired =
      Date.now() - new Date(this.resetPassword.expiresBy).getTime() < 300000
    return { validCode, codeNotExpired }
  })
}
UserSchema.methods.validateRefreshToken = function (token) {
  return __awaiter(this, void 0, void 0, function * () {
    const validToken = this.refreshToken.token === token
    const refreshTokenNotExpired =
      new Date(this.resetPassword.expiresBy).getTime() - Date.now() < 604800000
    const tokenVersionValid = this.tokenVersion - token.token_version === 1
    return { validToken, refreshTokenNotExpired, tokenVersionValid }
  })
}
UserSchema.methods.validatePassword = function (password) {
  return __awaiter(this, void 0, void 0, function * () {
    return (0, bcrypt_1.compare)(password, this.password)
  })
}
exports.User = (0, mongoose_1.model)('User', UserSchema)
