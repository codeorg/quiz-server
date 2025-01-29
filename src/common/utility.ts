import util from 'co-util'
import config from '../config';

class Utility {
    public getErr(code: number, ...arr) {
        let errMsg = config.err[code];
        if (!errMsg) {
            errMsg = `error code:${code} is not exist.`;
            console.error(errMsg)
        }
        return {
            err: code,
            msg: util.format(errMsg, ...arr)
        };
    }
}

export const utility = new Utility();