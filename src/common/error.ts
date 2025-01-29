
import { GraphQLError } from 'graphql';

export class Err extends GraphQLError {
    // private code: number;
    constructor(code, message) {
        super(message, {
            extensions: { code: code },
        }); // (1)
    }
}