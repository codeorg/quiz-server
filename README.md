# 测试服务端
## 所需环境
```git
node v22
```
## Install
```git
npm i
npm i -g nodemon
npm i -g ts-node 
npm i -g typescript
```
## 运行
```git
npm run start
```
本地默认地址 http://localhost:4000/

测试服务器地址 http://139.159.227.79:7020/

## 数据结构
```java
//order表
{
    "_id" : ObjectId("679cc722dc1fb33fc2d85c03"),
    "time" : 1738327842182.0,
    "userId" : "679cc6b3dc1fb33fc2d85c02",
    "status" : NumberInt(-1), //-1取消，0预订中，1成功
    "name" : "test5",
    "mobile" : "11111111117",
    "eta" : 1738252800000.0
}

//user表
{
    "_id" : ObjectId("679a33c4537a8d5f6784b5f3"),
    "username" : "test",
    "mobile" : "",
    "password" : "",
    "role" : "user",
    "time" : 1738159044898.0
}
```

