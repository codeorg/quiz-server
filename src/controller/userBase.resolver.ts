import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { db, lv, Err } from "../common"
import util from "co-util"

// @Resolver()
export class UserBaseResolver {
  constructor(@Ctx("user") user: any) {
    console.log('UserBaseResolver', user)
  }
}

