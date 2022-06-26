import { FastifyPluginAsync } from "fastify";
import {
  isAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../handlers/users.handler";
import {
  EditUserValidate,
  ChangePasswordForUser,
} from "../validators/auth.validators";
import {
  UserFullResponse,
  UsersArrayResponse,
} from "../validators/response.validators";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  const root = "/users";
  fastify.put(
    root + "/:id/change-password",
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { body: ChangePasswordForUser },
    },
    fastify.changePasswordForUser
  );

  fastify.get(
    root,
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { response: UsersArrayResponse },
    },
    getAllUsers
  );

  fastify.get(
    root + "/:id",
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { response: UserFullResponse },
    },
    getUserById
  );

  fastify.put(
    root + "/:id",
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { body: EditUserValidate, response: UserFullResponse },
    },
    updateUser
  );

  fastify.delete(
    root + "/:id",
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { response: UserFullResponse },
    },
    deleteUser
  );
};

export default users;
