
import { AuthChecker } from 'type-graphql';

export const authChecker: AuthChecker<any> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  // console.log('roles', roles)
  // console.log(root, args, context, info)
  if (!roles) return true;
  if (roles.indexOf('user') !== -1 && context.user && context.user.role == 'user') return true;
  if (roles.indexOf('admin') !== -1 && context.user && context.user.role == 'admin') return true;
  return false;
};