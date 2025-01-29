import path from 'path';
import Koa from 'koa';
import mount from 'koa-mount';
// import { buildSchema } from 'graphql';
//import { buildSchema } from 'type-graphql';
import { ObjectType, Field } from 'type-graphql';

import { graphqlHTTP } from 'koa-graphql';
// const { graphqlHTTP } = require('koa-graphql');


import { db } from './common'

 
@ObjectType()
export class Recipe {
  @Field()
  title: string;
 
  @Field()
  description: string;
}        


import { Resolver, Query, Args, Mutation } from 'type-graphql';
import { Recipe } from './Recipe';
 
@Resolver(Recipe)
export class RecipeResolver {
  @Query(() => [Recipe])
  async recipes() {
    // 这里应当从数据库获取数据
    return []; // 示例数据
  }
 
  @Mutation(() => Boolean)
  async addRecipe(@Args('title') title: string, @Args('description') description: string) {
    // 添加逻辑
    return true; // 操作成功标记
  }
}


// Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String,
//     user:User
//   }
//   type User {
//     reg(name:String,mobile:String):Boolean,
//     login(mobile:String,password:String):UserInfo,    
//   }

  
//   type UserInfo{
//     name: String,
//     mobile: String
//   }
// `);

// login(mobile:String,password:String):UserInfo,    

// type Order {
//   insert(userId:String,seatId:String),
//   update(mobile:String,password:String):UserInfo,    
// }
// type Seat {
//   update(seatId:String,status:Int):Boolean,    
// }


// function getResolvers() {
//     return [path.resolve(__dirname + '/resolvers/*.ts')];
// }





// The root provides a resolver function for each API endpoint
const root = {
    hello: () => 'Hello world!',

    user: {
        reg: async (arg: any, ctx: any) => {
            //console.log('ctx', ctx)


            const { name, mobile } = arg;
            console.log('name', name, mobile)
            let res = await db.user.insertOne({ name, mobile })
            console.log('res', res)
            if (!name) return false;
            return true;
        }
        ,
        login: (arg: any) => {
            const { name, password } = arg;
            return {
                name: name,
                mobile: password
            }
        }
    }


};

const app = new Koa();

// app.use((ctx, next) => {
//     const token = ctx.request.headers.authorization;
//     console.log('token', token)
//     if (token) {
//         // jwt.verify(token.split(' ')[1], 'secret', (err, decoded) => {
//         //     if (err) {
//         //         res.status(401).send({ error: 'Invalid token' });
//         //     } else {
//         //         req.user = decoded;
//         //         next();
//         //     }
//         // });
//         next();
//     } else {
//         next();
//     }
// });

app.use(
    mount(
        '/graphql',
        graphqlHTTP({
            schema,
            rootValue: root,
            graphiql: { headerEditorEnabled: true },
        }),
    ),
);

app.listen(4001, () => {
    console.log('Running a GraphQL API server at http://localhost:4001/graphql');
});
