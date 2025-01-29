import { ObjectType, Field, Float } from "type-graphql";

@ObjectType({ description: "位置" })
export class UserType {
  @Field()
  id!: number;//编号
  @Field()
  type: string;//A=1人位 B=2人位 C=3人位
}
