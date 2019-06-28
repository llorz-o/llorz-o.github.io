---
title: Mongodb入门篇
date: 2019-6-28
keys:
- '725361' 
categories:
 - 数据库 
tags:
 - no sql
 - mongodb
---

> 此篇为入门学习记录篇,基础不好就来看看。

<!-- more -->

## 安装

安装太过简单就不介绍了，只说重点

1. 安装完配置**环境变量**

    将`mongodb`安装目录下的`bin`目录的完整路径拷贝，复制到`window`的环境变量中

2. 在 `c` 盘根目录下新建 `data/db` 的目录 
3. 启动主进程 `mongod`
4. 启动操作进程 `mongo`

## 基本命令

1. `show dbs`查看本地的数据库
2. `db.version()` 查看版本号
3. `var a = 'a' ` 类似 `javascript` ，也可以直接定义函数参考 `node` 的 `REPL`
4. `print(a)` 输出至控制台

```shell

> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> db.version()
4.0.4
> var a = 'zhou'
> porint(a)
> print(a)
zhou
> function show(){
... return 'zhoulichao'
... }
> print(show())
zhoulichao
>  
```

### 库操作

1. `use <library name>` 进入数据库 成功:`switched to db <library name>`
2. `show collections` 展示数据库的集合
3. `db` 查看当前操作的所在库，类似`git`中的 `git branch`查看当前分支
4. `use <new library name>` 新建库
5. `db.user.insert({"name":"zhoulichao"})` 插入数据
6. `db.user.find()` 查询所有数据
7. `db.user.findOne()` 查询第一条
8. `db.user.update(Object<String>,Object<String>)` 更新，更改一条数据
9. `db.user.remove({"name":"zhoulichao"})` 删除某一条
10. `db.user.drop()` 整个集合
11. `db.dropDatabase( )` 一定要先进入数据库，然后再删除

```shell

> db.user.insert({"name":"Ruth"})
WriteResult({ "nInserted" : 1 })
> db.user.find()
{ "_id" : ObjectId("5d14e920b5ee2454bccd1598"), "name" : "zhoulichao" }
{ "_id" : ObjectId("5d14e971b5ee2454bccd1599"), "name" : "ruth" }
{ "_id" : ObjectId("5d14e97bb5ee2454bccd159a"), "name" : "HanMeiMei" }
{ "_id" : ObjectId("5d14ea1cb5ee2454bccd159c"), "name" : "Ruth" }
> db.user.findOne()
{ "_id" : ObjectId("5d14e920b5ee2454bccd1598"), "name" : "zhoulichao" }
> db.user.update({"name":"zhoulichao"},{"name":"zhoulichao","age":"23","gender":"male"}))
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.user.findOne()
{
        "_id" : ObjectId("5d14e920b5ee2454bccd1598"),
        "name" : "zhoulichao",
        "age" : "23",
        "gender" : "male"
}
> db.user.remove({"name":"zhoulichao"})
WriteResult({ "nRemoved" : 1 })
> db.user.find()
{ "_id" : ObjectId("5d14e971b5ee2454bccd1599"), "name" : "ruth" }
{ "_id" : ObjectId("5d14e97bb5ee2454bccd159a"), "name" : "HanMeiMei" }
{ "_id" : ObjectId("5d14ea1cb5ee2454bccd159c"), "name" : "Ruth" }
> db.user.drop()
true


```

:::tip
mongodb采用小驼峰命名法
:::




## js写mongo

```js

var user_name = 'zhoulichao'
var timeStamp = Date.parse(new Date())
var data = {
    "loginname":user_name,
    "logintime":timeStamp
}
var db = connect('log') // 链接数据库，没有则创建
db.login.insert(data) // 在 login 集合中插入 data 数据，没有则创建

print('[demo]: log print success')

```

> 这里的js建议使用`var` 来命名变量，如果使用 `let` 命名 `db` 时会产生一个预期之外的错误。其他的变量如`user_name,timeStamp,data`则不会产生该错误，
鉴于避免未知错误的发生，应避免使用 `let`

### batch insert 批量插入

```js

var data = [ // 以数组形式就是批量插入
    {
        "_id":1
    }
    ,{
        "_id":2
    }
    ,{
        "_id":3
    }
]

var db = connect('test')

db.batch.insert(data)

print('[test]: batch insert success')

```

> 批量插入单次数据量不可超过 `48m`，`3.2`之前的版本使用`batchInsert()`

### 插入性能对比

```js

/* 测试批量插入与循环插入的性能 */

var origin_data = 'qwertyuiopasdfghjklzxcvbnm1234567890_-'.split(''),
    len = origin_data.length,
    data = []
var generation = function(){
    var random = Math.floor(Math.random() * len)
    return origin_data[random]
}

var len_generation = function(min,max){
    return Math.floor(Math.random() * (max -min)) + min
}

var str_generation = function(num){
    let res = ''
    for(let i = 0; i < num; i++){
        res += generation()
    }
    return res
}

var data_generation = function(num){

    for(let i = 0;i < num ; i++){
        data.push({
            name:str_generation(len_generation(5,10)),
            text:str_generation(len_generation(10,20))
        })
    }

}

data_generation(100)

var db = connect('test')

var cycle = function(){
    let begin = new Date().getTime()
    data.forEach(item => {
        db.diff.insert(item)
    })
    print(new Date().getTime() - begin, 'cycle insert ms')
}

var batch = function(){
    let begin = new Date().getTime()
    db.diff.insert(data)
    print(new Date().getTime() - begin, 'batch insert ms')
}

cycle()
batch()

// 50 cycle insert ms
// 2 batch insert ms

```

毫无疑问批量插入是最快的方式