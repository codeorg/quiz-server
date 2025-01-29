import config from '../config';
import { LevelClient, Level } from 'lv-client'
// import {LevelEntity} from "./level.entity";

//Level Collection 定义超时时间
class LevelCollection {
    @Ex(60 * 60 * 24)
    sess!: Level;
    @Ex()
    client!: Level;
    @Ex(15 * 60)
    code!: Level;
    @Ex(60 * 60)
    token!: Level;
    @Ex()
    cache!: Level;
    @Ex(15 * 60)
    tmp!: Level;
  

    static collections: any = [];
}

function Ex(second?: number) {
    return function (target: any, key: string, expression?: boolean | Function) {
        // console.log('target', target, key)
        if (!second) {
            //可以直接修改config,但是装饰器必须要有人调用
            LevelCollection.collections.push(key);
        } else {
            LevelCollection.collections.push({ name: key, expire: second })
        }
    };
}

config.level.collections = LevelCollection.collections;
let levelClient = new LevelClient<LevelCollection>(config.level);

levelClient.on('connect', (msg) => {
    console.log(msg, 'started.')
})

levelClient.on('error', err => {
    console.error(err);
})

export const lv: LevelCollection = levelClient.db;





