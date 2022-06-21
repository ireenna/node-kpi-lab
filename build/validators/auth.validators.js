'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.EditUserValidate =
  exports.ChangeAccountPassword =
  exports.EditAccountValidate =
  exports.RegisterUserValidate =
  exports.LoginUserValidate =
    void 0
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
}
exports.RegisterUserValidate = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', minLength: 6, unique: true },
        password: { type: 'string', minLength: 6 },
        name: { type: 'string', minLength: 5 },
        avatar: { type: 'string', default: '' },
        isAdmin: { type: 'boolean', default: false }
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
}
exports.EditAccountValidate = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 6, unique: true },
    name: { type: 'string', minLength: 5 },
    avatar: { type: 'string', default: '' }
  }
}
exports.ChangeAccountPassword = {
  type: 'object',
  properties: {
    oldPassword: { type: 'string' },
    newPassword: { type: 'string', minLength: 6 }
  },
  required: ['oldPassword', 'newPassword']
}
exports.EditUserValidate = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 6, unique: true },
    name: { type: 'string', minLength: 5 },
    avatar: { type: 'string', default: '' },
    isAdmin: { type: 'boolean' }
  }
}
