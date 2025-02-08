import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { db, lv, Err } from "../../common"
import util from "co-util"
import { OrderType } from './order.type'

@Resolver()
export class OrderResolver {
  /**
 * 订单列表 for 管理员
 * @param {MyContext} user 登录用户，上下文传入
 * @param {number} eta 根据预计到达时间进行过滤
 * @param {number} status 根据订单状态进行过滤 -1取消，0预订中，1成功
 * @return {Array} 返回值
 */
  @Authorized("admin")
  @Query(returns => [OrderType])
  async findOrders(@Ctx("user") user: any, @Arg("eta", { nullable: true }) eta: number, @Arg("status", { nullable: true }) status: number) {
    console.log('status', status)
    let con: any = {};
    if (!!status || status == 0) {
      con.status = status;
    }
    if (eta) {
      con.eta = util.dayTime(eta, 0);
    }

    let orders = await db.order.find(con).sort({ eta: -1 }).toArray();
    console.log('orders', orders)
    return orders
  }
  /**
  * 用户我的订单
  * @param {MyContext} user 登录用户，上下文传入
  * @param {number} status 根据订单状态进行过滤 -1取消，0预订中，1成功
  * @return {Array} 返回值
  */
  @Authorized("user")
  @Query(returns => [OrderType])
  async findMyOrders(@Ctx("user") user: any, @Arg("status", { nullable: true }) status: number) {
    console.log('status', status)
    let con: any = { userId: user._id };
    if (!!status || status == 0) {
      con.status = status;
    }
    let orders = await db.order.find(con).sort({ eta: -1 }).toArray();
    console.log('orders', orders)
    return orders
  }

  /**
 * 订单详情
 * @param {MyContext} user 登录用户，上下文传入
 * @param {string} orderId 订单ID
 * @return {Object} 返回值
 */
  @Authorized(["user", "admin"])
  @Query(returns => OrderType)
  async findOneOrder(@Ctx("user") user: any, @Arg("orderId") orderId: string) {
    let con: any = { _id: db.ObjectId(orderId) };
    let order = await db.order.findOne(con);
    console.log('order', order)
    return order
  }

  /**
  * 用户/管理员 取消预订
  * @param {MyContext} user 登录用户，上下文传入
  * @param {string} orderId 订单ID
  * @return {Boolean} 返回值
  */
  @Authorized(["user", "admin"])
  @Mutation(returns => Boolean)
  async cancelOrder(@Ctx("user") user: any, @Arg("orderId") orderId: string) {
    // console.log('user', user)
    let con: any = { _id: db.ObjectId(orderId) }
    let order = await db.order.findOne(con);
    if (user.role != 'admin' && order.userId != user._id) throw new Err(4005, '该座位不属于当前用户')
    await db.order.updateOne(con, {
      $set: {
        status: -1
      }
    });
    return true
  }
  /**
  * 管理员设置通过预订
  * @param {MyContext} user 登录用户，上下文传入
  * @param {string} orderId 订单ID
  * @return {Boolean} 返回值
  */
  @Authorized("admin")
  @Mutation(returns => Boolean)
  async approveOrder(@Ctx("user") user: any, @Arg("orderId") orderId: string) {
    // console.log('user', user)
    let con: any = { _id: db.ObjectId(orderId) }
    let order = await db.order.findOne(con);
    await db.order.updateOne(con, {
      $set: {
        status: 1
      }
    });
    return true
  }

  /**
 * 用户申请预订
 * @param {MyContext} user 登录用户，上下文传入
 * @param {number} eta 预计到达时间
 * @param {string} name 姓名
 * @param {string} mobile 手机号
 * @return {Boolean} 返回值
 */
  @Authorized("user")
  @Mutation(returns => Boolean)
  async insertOrder(@Ctx("user") user: any, @Arg("eta") eta: number, @Arg("name") name: string, @Arg("mobile") mobile: string) {
    let day = util.dayTime(eta, 0);
    await db.order.insertOne({
      time: new Date().getTime(),
      userId: user._id,
      status: 0, //-1取消，0预订中，1成功
      name,
      mobile,
      eta: day,
    });
    return true
  }

  /**
 * 用户/管理员修改预订
 * @param {MyContext} user 登录用户，上下文传入
 * @param {string} orderId 订单ID
 * @param {number} eta 预计到达时间
 * @param {string} name 姓名
 * @param {string} mobile 手机号
 * @return {Boolean} 返回值
 */
  @Authorized(["user", "admin"])
  @Mutation(returns => Boolean)
  async updateOrder(@Ctx("user") user: any, @Arg("orderId") orderId: string, @Arg("eta") eta: number, @Arg("name") name: string, @Arg("mobile") mobile: string) {
    let con: any = { _id: db.ObjectId(orderId) }
    let order = await db.order.findOne(con);
    if (!order) throw new Err(4006, '预定不存在')
    if (user.role != 'admin' && order.userId != user._id) throw new Err(4005, '该座位不属于当前用户')
    let Up: any = {
      name,
      mobile,
      eta,
      // status: 0
    }
    if (user.role == 'user') {
      //用户编辑后，重审
      Up.status = 0;
    }
    await db.order.updateOne(con, {
      $set: Up
    });
    return true
  }


}

