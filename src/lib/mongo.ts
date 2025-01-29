"use strict";
let util = require('co-util');
// let mongodb = require('mongodb');
// const {MongoClient, ObjectId} = require('mongodb');
import { MongoClient, ObjectId } from 'mongodb';

// const MongoClient = require('mongodb').MongoClient;


export class Mongo<T> {
    private opts: any;
    private client: any;
    public db: any = <T>{};

    constructor(opts: any) {
        this.opts = opts;
        console.log('this.opts', this.opts)
        let server = this.parseUrl(opts.url);
        if (!server) throw new Error('mongodb url 格式不对');
        console.log('server', server)
        util.extend(this.opts, server)
        this.connect();
        // this.createCollections();
    }

    parseUrl(url: string) {
        if (!url) return null;
        //'mongodb://admin:ZDSFs#421$@116.62.11.80:7017/db_wmpj',
        let pat = /^mongodb:\/\/([^\:@]+):([^\:@]+)@([^\:@]+):([0-9]+)\/([\w\W]+)$/gi
        let m: any = pat.exec(url);
        if (!m || m.length < 6) return null;

        let obj: any = {
            host: m[3],
            port: util.toInt(m[4]),
            username: m[1],
            password: m[2],
            database: m[5],
        }
        let f = 'mongodb://%s:%s@%s:%s/%s'
        obj.url = util.format(f, obj.username, obj.password, obj.host, obj.port, obj.database);
        return obj;
    }

    async connect() {

        this.client = new MongoClient(this.opts.url);

        let auth = await this.client.db("admin").command({ ping: 1 }).catch(e => e);
        if (auth instanceof Error) {
            console.error('mongodb认证失败', this.opts.url)
            throw auth;
        }
        console.log(this.opts.url, ' started.')


        for (let collection of this.opts.collections) {

            this.db[collection] = this.collection(collection);
            this.db[collection].page = async (con: any) => {
                let sort = con.option.sort || { _id: -1 };
                let size = util.toInt(con.option.size) || 10;
                let skip = util.toInt(con.option.current);
                skip = skip - 1;
                if (skip < 1) skip = 0;
                skip = skip * size;
                return Promise.all([this.collection(collection).find(con.query).count(),
                this.collection(collection).find(con.query).sort(sort).limit(size).skip(skip).toArray()]).then(arr => {
                    return { count: arr[0], rows: arr[1] }
                });
            }
        }

        this.db['ObjectId'] = ObjectId.createFromHexString;
    }

    // createCollections() {
    //     for (let collection of this.opts.collections) {

    //         this.db[collection] = this.collection(collection);
    //         this.db[collection].page = async (con: any) => {
    //             let sort = con.option.sort || { _id: -1 };
    //             let size = util.toInt(con.option.size) || 10;
    //             let skip = util.toInt(con.option.current);
    //             skip = skip - 1;
    //             if (skip < 1) skip = 0;
    //             skip = skip * size;
    //             return Promise.all([this.collection(collection).find(con.query).count(),
    //             this.collection(collection).find(con.query).sort(sort).limit(size).skip(skip).toArray()]).then(arr => {
    //                 return { count: arr[0], rows: arr[1] }
    //             });
    //         }
    //     }

    //     this.db['ObjectId'] = ObjectId.createFromHexString;
    // }

    database(dbName: string) {
        return this.client.db(dbName)
    }

    collection(name: string) {
        return this.client.db(this.opts.database).collection(name);
    }
}
