import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { buildSchemaSync } from 'type-graphql';
import { Container } from "typedi";
import util from 'co-util';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Log } from 'co-log';

import { schema } from './controller/schema';
import { MyContext } from './controller/interface'
import { lv, Err } from './common'
import config from './config'
const PORT = process.env.port || 4000;
const app = express();

async function run() {
    // const schema = buildSchemaSync({ resolvers: [RecipeResolver]})
    const server = new ApolloServer<MyContext>({
        schema,
        // typeDefs,
        // resolvers,
        //plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        introspection: process.env.NODE_ENV !== 'production',
        plugins: [
            {
                async serverWillStart() {
                    console.log('Server starting!');
                }
            },
            {
                async requestDidStart(initialRequestContext) {
                    const start: bigint = process.hrtime.bigint();

                    if (initialRequestContext.request.operationName !== 'IntrospectionQuery') {
                        console.log('START', initialRequestContext.request.query);
                        console.log('variables', initialRequestContext.request.variables);
                    }
                    return {
                        willSendResponse: async (requestContext: any) => {
                            const end: bigint = process.hrtime.bigint();

                            if (requestContext.operationName !== 'IntrospectionQuery') {
                                console.log('END', requestContext.operationName, (end - start) / BigInt(1000000) + 'ms');
                                // console.log('END', JSON.stringify(requestContext.response.body.singleResult), (end - start) / BigInt(1000000) + 'MS');
                            }
                        }
                    }
                }
            },

        ]

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

    await server.start();

    app.use(new Log(config.log).setRequestIdForExpress());

    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }: any) => {
                //console.error('start');
                const token = req.headers.authorization || '';
                // console.log('token-----', token)
                if (token) {
                    let user = await lv.sess.get(token);
                    // console.log('user-----', user)
                    if (user) return { user }
                    // console.log('request id', req.id)
                    throw new Err(4004, 'token过期')
                }
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