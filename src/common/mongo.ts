import config from '../config';
import {Mongo} from '../lib';
import {Collection} from 'mongodb';


class MongoCollection {
    @Table()
    user: Collection;

    @Table()
    seat: Collection;
    @Table()
    order: Collection;

    ObjectId(id: string) {
    };

    static collections = [];
}

function Table() {
    return function (target: any, key: string, expression?: boolean | Function) {
        MongoCollection.collections.push(key)
    };
}

config.mongo.collections = MongoCollection.collections;
let mongoClient = new Mongo<MongoCollection>(config.mongo);

export const db: MongoCollection = mongoClient.db;
