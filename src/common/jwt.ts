import config from '../config';
import {JWT} from '../lib';

class Jwt extends JWT {
    encode(obj) {
        return super.encode(obj, config.jwt.key, config.jwt.expire)
    }

    decode(token) {
        return super.decode(token, config.jwt.key)
    }
}

export const jwt: Jwt = new Jwt();