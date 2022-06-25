import { FastifyPluginAsync } from "fastify";
import {
  isAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../handlers/users.handler";
import { EditUserValidate, ChangePasswordForUser } from "../validators/auth.validators";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.put(
    "/users/:id/change-password",
      {
          onRequest: [fastify.jwtauthenticate, isAdmin],
          schema: { body: ChangePasswordForUser }
      },
    fastify.changePasswordForUser
  );

  fastify.get(
    "/users",
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    getAllUsers
  );

  fastify.get(
    "/users/:id",
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    getUserById
  );

  fastify.put(
    "/users/:id",
    {
      onRequest: [fastify.jwtauthenticate, isAdmin],
      schema: { body: EditUserValidate },
    },
    updateUser
  );

  fastify.delete(
    "/users/:id",
    { onRequest: [fastify.jwtauthenticate, isAdmin] },
    deleteUser
  );
};

export default users;
