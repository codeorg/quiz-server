import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { UserType } from "./user.type";
import { db, lv, Err } from "../../common"
import config from "../../config"
import util from "co-util"

@Resolver()
export class UserResolver {

  @Query(returns => Boolean)
  async reg(
    @Arg("username") username: string,
    @Arg("mobile") mobile: string,
    @Arg("password") password: string,
    @Arg("role") role: string,
  ) {
    let user = await db.user.findOne({ mobile: mobile });
    if (user) throw new Err(4001, '手机号已经存在')
    let user2 = await db.user.findOne({ username: username });
    if (user2) throw new Err(4008, '用户名已经存在')
    if (role != 'user' && role != 'admin') throw new Err(4009, '用户角色不合法')
    await db.user.insertOne({ username, mobile, password, role: role, time: new Date().getTime() });
    return true
  }

  @Query(returns => String)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
  ) {
    let user = await db.user.findOne({ username: username });
    if (!user) throw new Err(4002, '用户不存在')
    if (!password) throw new Err(4003, '密码不能为空')
    if (user.password != password) throw new Err(4003, '密码不一致')
    let token = util.uuid();
    user.token = token;
    delete user.password
    await lv.sess.set(token, user);
    user.menu = config.menu[user.role]
    return JSON.stringify(user)
  }

  @Authorized("user")
  @Query(returns => Boolean)
  async logout(@Ctx("user") user: any) {
    await lv.sess.remove(user.token);
    return true
  }


}

