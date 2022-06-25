export const LoginUserValidate = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
    },
    required: ["email", "password"]
} as const;

export const RegisterUserValidate = {
    type: "object",
    properties: {
        email: { type: "string", format: "email", minLength: 6 },
        password: { type: "string", minLength: 6 },
        name: { type: "string", minLength: 5 },
        avatar: { type: "string", default: "" },
        isAdmin: { type: "boolean", default: false }
    },
    required:["email", "password", "name"]
} as const;

export const EditAccountValidate = {
    type: "object",
    properties: {
        email: { type: "string", format: "email", minLength: 6 },
        name: { type: "string", minLength: 5 },
        avatar: { type: "string", default: "" },
    }
} as const;

export const ChangeAccountPassword = {
    type: "object",
    properties: {
        oldPassword: { type: "string" },
        newPassword: { type: "string", minLength: 6 },
    },
    required: ["oldPassword", "newPassword"],
} as const;

export const ChangePasswordForUser = {
    type: "object",
    properties: {
        newPassword: { type: "string", minLength: 6 },
    },
    required: ["newPassword"],
} as const;

export const EditUserValidate = {
  type: "object",
  properties: {
    email: { type: "string", format: "email", minLength: 6 },
    name: { type: "string", minLength: 5 },
    avatar: { type: "string", default: "" },
    isAdmin: { type: "boolean" },
  },
} as const;