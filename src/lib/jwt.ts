
/**
 * Created by kalaco on 2021/12/14.
 */
const jose = require('jose');

export class JWT {
    async getJwk(key: string) {
        // if (this.jwk) return this.jwk;
        return await jose.importJWK({
            alg: 'HS256',
            k: key,
            kty: 'oct',
        });
    }

    async encode(obj: any, key: string, expire: number) {
        let jwk = await this.getJwk(key);
        const token = await new jose.SignJWT(obj)
            .setProtectedHeader({ alg: 'HS256' })
            // .setIssuedAt()
            // .setIssuer('urn:example:issuer')
            // .setAudience('urn:example:audience')
            .setExpirationTime(expire + 's')
            .sign(jwk);
        //console.log(token);
        return token;
    }

    async decode(token: string, key: string) {
        let jwk = await this.getJwk(key);
        let res = await jose.jwtVerify(token, jwk).catch((e: any) => e);
        //console.log(res)
        if (res instanceof Error) {
            console.error('jwt解析失败', res.message)
            return false;
        }
        if (!res.payload) return false;
        // if(res.payload.exp)delete res.payload.exp;
        return res.payload;
    }

}

