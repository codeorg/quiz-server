// import redis from './redis'
import log from './log'
import { jwt } from './jwt'
import { level } from './level'
import { mongo } from './mongo'
import { menu } from './menu'

let config: any = {
    env: 'dev',
    key: '111111111222',
    // api: 'https://dev.msdp.cn',
    router: { staticServerPath: 'public' },
    level: level,
    mongo: mongo,
    menu,
    jwt: jwt,
    log
}
export default config;
