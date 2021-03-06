import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user";
import { compare, hash } from "bcrypt";

export const validateEmail = function (email: string) {
  const re = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      immutable: true,
      validate: [validateEmail, "Please, write valid email"],
    },
    hashPassword: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("hashPassword")) {
    this.hashPassword = await hash(this.hashPassword, 10);
  }
  next();
});

UserSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  return compare(password, this.hashPassword);
};

export const User = model<IUser>("User", UserSchema);
