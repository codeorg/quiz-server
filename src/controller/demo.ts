import { ObjectType, Field } from 'type-graphql';
// import { Field, ArgsType, Int } from "type-graphql";

import { Resolver, Query, Arg, Mutation } from 'type-graphql';

// @ArgsType()
// export class Arguments {
//   @Field()
//   type: string;
//   @Field(type => Int, { nullable: true })
//   dbid: number;
//   @Field(type => Int, { nullable: true })
//   point: number;
// }



@ObjectType()
class Recipe {
    @Field()
    title: string;

    @Field()
    description: string;
}



@Resolver(Recipe)
export class RecipeResolver {
    @Query(() => [Recipe])
    async recipes() {
        // 这里应当从数据库获取数据
        return [{title:'sss',description:'dddd'}]; // 示例数据
    }

    @Mutation(() => Boolean)
    async addRecipe(@Arg("title") title: string, @Arg("description") description: string) {
        console.log(title)
        console.log(description)
        // 添加逻辑
        return true; // 操作成功标记
    }
}

