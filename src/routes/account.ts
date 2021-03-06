import { FastifyPluginAsync } from "fastify";
import {
  EditAccountValidate,
  ChangeAccountPassword,
} from "../validators/auth.validators";
import { UserResponse } from "../validators/response.validators";

import { getCurrentAccount, UpdateAccount } from "../handlers/account.handler";

const accounts: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    "/account",
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { response: UserResponse },
    },
    getCurrentAccount
  );

  fastify.put(
    "/account/change-password",
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: ChangeAccountPassword },
    },
    fastify.changePassword
  );
  fastify.put(
    "/account",
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: EditAccountValidate, response: UserResponse },
    },
    UpdateAccount
  );
};
export default accounts;
