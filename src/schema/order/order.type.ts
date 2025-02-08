import { ObjectType, Field, Float } from "type-graphql";

@ObjectType({ description: "订单" })
export class OrderType {
  @Field()
  _id: string;
  @Field()
  status: number;
  @Field({ nullable: true })
  userId: string;
  @Field()
  name: string;
  @Field()
  mobile: string;
  @Field()
  eta: number;
  @Field()
  time: number;
}
