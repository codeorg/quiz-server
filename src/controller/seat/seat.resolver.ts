import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { UserType } from "./seat.type";
import { db, lv, Err } from "../../common"
import util from "co-util"
import { UserBaseResolver } from '../userBase.resolver'

@Resolver()
export class SeatResolver {
  // @Authorized("user")
  // @Query(returns => Boolean)
  // async findSeat2(@Ctx("user") user: any) {
  //   console.log('user', user)
  //   // let user = await db.user.findOne({});
  //   // if (user) throw new Err(4001, '手机号已经存在')
  //   await db.user.findOne();
  //   return true
  // }


  @Query(returns => Boolean)
  async insertSeat() {
    // console.log('user', user)
    // let user = await db.user.findOne({});
    // if (user) throw new Err(4001, '手机号已经存在')
    let types = ['A', 'B', 'C'];
    for (let i = 0; i < 100; i++) {
      let index = util.random(0, types.length - 1);
      await db.seat.insertOne({ id: i + 1, type: types[index] });
    }

    return true
  }

}

