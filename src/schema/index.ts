import { buildSchemaSync } from 'type-graphql';
import { UserResolver } from './user/user.resolver'
import { OrderResolver } from './order/order.resolver'
import { authChecker } from './authChecker'


export const schema = buildSchemaSync({
    resolvers: [UserResolver,  OrderResolver],
    authChecker: authChecker,
})

