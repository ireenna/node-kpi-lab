export const LoginUserValidate = {
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
export const RegisterUserValidate = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', minLength: 6 },
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
export const EditAccountValidate = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 6},
    name: { type: 'string', minLength: 5 },
    avatar: { type: 'string', default: '' }
  }
}
export const ChangeAccountPassword = {
  type: 'object',
  properties: {
    oldPassword: { type: 'string' },
    newPassword: { type: 'string', minLength: 6 }
  },
  required: ['oldPassword', 'newPassword']
}
export const EditUserValidate = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 6},
    name: { type: 'string', minLength: 5 },
    avatar: { type: 'string', default: '' },
    isAdmin: { type: 'boolean' }
  }
}
