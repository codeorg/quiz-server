import { ObjectType, Field, Float } from "type-graphql";

@ObjectType({ description: "用户信息" })
export class UserType {
  @Field()
  name!: number;
  @Field()
  mobile!: string;
}
