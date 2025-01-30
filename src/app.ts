import 'reflect-metadata';
import { ApolloServer, } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { buildSchemaSync } from 'type-graphql';
import { Container } from "typedi";
import util from 'co-util';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { schema } from './controller/schema';
import { MyContext } from './controller/interface'
import { lv, Err } from './common'
const PORT = process.env.port || 4000;

// interface MyContext {
//     user?: any;
// }


const app = express();
// const httpServer = http.createServer(app);

// const server = new ApolloServer({ schema });
// // server.applyMiddleware({ app, path: '/graphql' });

// app.listen(4000, () => {
//   console.log('Server ready at http://localhost:4000/graphql');
// });


// Set up Apollo Server
// app.use(function (err, req, res, next) {
//     console.error(err);
//     console.error(err.name);
//     res.status(500).send('Something broke!');
// });

async function run() {
    // const schema = buildSchemaSync({ resolvers: [RecipeResolver]})
    const server = new ApolloServer<MyContext>({
        schema,
        // typeDefs,
        // resolvers,
        //plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        // formatError: (err:any) => {

        //     // 对错误进行处理，例如添加更多的上下文信息或修改错误消息等。
        //     throw new Error(`Internal server error: ${err.message}`);
        // }
        // formatError: (formattedError, error) => {
        //     // Return a different error message
        //     if (
        //         formattedError.extensions.code
        //     ) {
        //         return {
        //             ...formattedError,
        //             code: formattedError.extensions.code,
        //             message: "Your query doesn't match the schema. Try double-checking it!",
        //         };
        //     }

        //     // Otherwise return the formatted error. This error can also
        //     // be manipulated in other ways, as long as it's returned.
        //     return formattedError;
        // },

    });

    // const { url } = await startStandaloneServer(server, {
    //     context: async ({ req }) => {
    //         // get the user token from the headers
    //         const token = req.headers.authorization || '';
    //         console.log('token-----', token)
    //         if (token) {
    //             let user = await lv.sess.get(token);
    //             console.log('user-----', user)
    //             if (user) return { user }
    //         }
    //         // try to retrieve a user with the token
    //         //   const user = getUser(token);

    //         //   // optionally block the user
    //         //   // we could also check user roles/permissions here
    //         //   if (!user)
    //         //     // throwing a `GraphQLError` here allows us to specify an HTTP status code,
    //         //     // standard `Error`s will have a 500 status code by default
    //         //     throw new GraphQLError('User is not authenticated', {
    //         //       extensions: {
    //         //         code: 'UNAUTHENTICATED',
    //         //         http: { status: 401 },
    //         //       }
    //         //     });

    //         // add the user to the context
    //         return
    //     },
    // });
    await server.start();


    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {

                // get the user token from the headers
                const token = req.headers.authorization || '';
                // console.log('token-----', token)
                if (token) {
                    let user = await lv.sess.get(token);
                    // console.log('user-----', user)
                    if (user) return { user }
                    throw new Err(4004, 'token过期')
                }
                // try to retrieve a user with the token
                //   const user = getUser(token);

                //   // optionally block the user
                //   // we could also check user roles/permissions here
                //   if (!user)
                //     // throwing a `GraphQLError` here allows us to specify an HTTP status code,
                //     // standard `Error`s will have a 500 status code by default
                //     throw new GraphQLError('User is not authenticated', {
                //       extensions: {
                //         code: 'UNAUTHENTICATED',
                //         http: { status: 401 },
                //       }
                //     });

                // add the user to the context
                return
            },
        }),
    );

    app.use(function (err, req, res, next) {
        console.error(err);
        console.error(err.name);
        res.status(500).send('Something broke!');
    });

    app.listen({ port: PORT })
    // await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

run()