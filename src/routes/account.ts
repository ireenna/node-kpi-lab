import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
    FastifyInstance
} from 'fastify'
import {
  EditAccountValidate,
    ChangeAccountPassword
} from '../validators/auth.validators'
import { getCurrentAccount, UpdateAccount } from "../handlers/account.handler";

const accounts: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/account',
        { onRequest: [fastify.jwtauthenticate] },
        getCurrentAccount
    );

  fastify.put(
    '/account/change-password',
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: ChangeAccountPassword }
    },
    fastify.changePassword
  )
  fastify.put(
    '/account',
    {
      onRequest: [fastify.jwtauthenticate],
      schema: { body: EditAccountValidate }
    },
    UpdateAccount
  )
}
export default accounts
