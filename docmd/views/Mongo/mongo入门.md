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
> 鉴于避免未知错误的发生，应避免使用 `let`

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

var db = connect('test') // 连接一个数据库，没有则创建

var cycle = function(){
    let begin = new Date().getTime()
    data.forEach(item => {
        db.diff.insert(item) // 在当前库的集合中插入，没有则创建
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

### 插入文档

1. inset(data:Object||Array) // 使用数组即为批量插入

```js

db.test.insert([
{id:1},{id:2}
])

```
2. save([ id:Object<String>,])

```js

db.test.save() // 不指定id字段即为插入,指定id则为更新, 注意该id为对象id，你无法直接写入 {_id:''}, 这种方式并没有什么卵用

```

### 更新文档

1. update(query :Object,update:Object,[upsert :Boolean,multi :Boolean,writeConcern :Object])
 - **query ** update的查询条件
 - **update **  update的对象和一些更新的操作符
 - **upsert ** 如果该条记录不存在是否直接插入，default:false { 不插入 }
 - **multi ** default：false { 只更新找到的第一条数据 }
 - **writeConcern ** 抛出异常级别

```js

//只更新第一条记录：

db.col.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } );
//全部更新：

db.col.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true );
//只添加第一条：

db.col.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false );
//全部添加进去:

db.col.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true );
//全部更新：

db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );
//只更新第一条记录：

db.col.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );

//修改嵌套内容
db.test.update( { name:'zhoulichao' },{
    $set:{
        skill.skillOne:'这条数据就是该文档的 skill 对象下的 skillOne 数据'
    }
} )

```


2. save(document:Object,writeConcern :Object)
 - **document** 保存的数据，如果传入id就是覆盖该id原来的数据，不传入则是插入

```js

db.test.save({
    _id:ObjectId('56064f89ade2f21f36b03136'),
    name:'超人不穿内裤'
})

```

### 删除文档

1. remove([query :Object,[justOne :Boolean,[writeConcern :Object]]])
  - **query** 删除的文档的条件
  - **justOne** default:false 删除所有匹配条件的文档

```js

db.user_info.remove({
    _id:ObjectId('5d1a014af39338a5301ebea7')
})

```

### 查询文档&条件查询

1. find([query :Object,[projection :??]])
 - **query** 查询条件
 - **projection** 使用投影操作符指定返回的键。查询时返回文档中所有键值

```js
db.user_info.find({
    _id:ObjectId('5d1a014af39338a5301ebea9')
})
```




2. pretty() find的修饰符,用于以格式化的方式来显示所有文档。 

```js
db.user_info.find().pretty()
```



3. findOne ([query :Object,[projection :??]])  返回一个文档
4. where 语句

|   操作   | 格式         |
| :------: | ------------ |
|   等于   | {k:v}        |
|   小于   | {k:{$lt:v}}  |
| 小于等于 | {k:{$lte:v}} |
|   大于   | {k:{$gt:v}}  |
| 大于等于 | {k:{$gte:v}} |
|   不等   | {k:{$ne:v}}  |

5.  AND

```JS
db.test.find({
    name:'liu',
    age:12
})
// 多个查询条件既是 and
```

6. OR

```JS
db.test.find({
    $or:[
        {name:'liu'},
        {age:{
            $lt:20， // 小于20
        }},
    ]
})
```

7. AND **+** OR

```JS
db.test.find({
    name:'liu',
    $or:[
        {age:15},
        {age:20},
    ]
})
```

8. 模糊查询

```js
db.test.find({
    name:/^周/
})
```

### $type 

| **类型**                | **数字** | **备注**         |
| ----------------------- | -------- | ---------------- |
| Double                  | 1        |                  |
| String                  | 2        |                  |
| Object                  | 3        |                  |
| Array                   | 4        |                  |
| Binary data             | 5        |                  |
| Undefined               | 6        | 已废弃。         |
| Object id               | 7        |                  |
| Boolean                 | 8        |                  |
| Date                    | 9        |                  |
| Null                    | 10       |                  |
| Regular Expression      | 11       |                  |
| JavaScript              | 13       |                  |
| Symbol                  | 14       |                  |
| JavaScript (with scope) | 15       |                  |
| 32-bit integer          | 16       |                  |
| Timestamp               | 17       |                  |
| 64-bit integer          | 18       |                  |
| Min key                 | 255      | Query with `-1`. |
| Max key                 | 127      |                  |

```js
// EXAMPLE 
db.test.find({
    name:{
        $type:'string', 
    }
})
// EXAMPLE
db.test.find({
    name:{
        $type:2, 
    }
})
```

### limit & skip

1. limit(num :Number)

```js
db.test.find().limit(2) // 返回查询集中的两条
```

2. skit(num :Number)

```js
db.test.find().skip(10) // 跳过前10条数据
```

### 排序

1. sort(condition :Object)

```js
db.test.find.sort({
    age:1, // 升序， -1 降序
})
```

> ! skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。 

### 索引

1. createIndex(key :Object [,opts : Object])

| Parameter          | Type          | Description                                                  |
| ------------------ | ------------- | ------------------------------------------------------------ |
| background         | Boolean       | 建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为**false**。 |
| unique             | Boolean       | 建立的索引是否唯一。指定为true创建唯一索引。默认值为**false**. |
| name               | string        | 索引的名称。如果未指定，MongoDB的通过连接索引的字段名和排序顺序生成一个索引名称。 |
| dropDups           | Boolean       | 3.0+版本已废弃。在建立唯一索引时是否删除重复记录,指定 true 创建唯一索引。默认值为 **false**. |
| sparse             | Boolean       | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为true的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 **false**. |
| expireAfterSeconds | integer       | 指定一个以秒为单位的数值，完成 TTL设定，设定集合的生存时间。 |
| v                  | index version | 索引的版本号。默认的索引版本取决于mongod创建索引时运行的版本。 |
| weights            | document      | 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重。 |
| default_language   | string        | 对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语 |
| language_override  | string        | 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的language，默认值为 language. |

```js
// EXAMPLE
db.test.createIndex({
    age:1, // 升序or -1 降序索引
})
// EXMPLE 多字段索引
db.test.createIndex({
    age:1, 
    name:-1, 
})
```

2. ensureIndex(key :Object)

```js
// EXMPLE 多字段索引
db.test.ensureIndex({
    age:1, 
    name:-1, 
})
```

3. getIndexes()  查看集合索引 

```js
db.test.getIndexs()
```

4. totalIndexSize() 查看集合索引大小 

```js
db.test.totalIndexSize()
```

5. dropIndexs() 删除所有索引

```js
db.test.dropIndexs()	
```

6. dropIndex(name :String) 删除集合指定索引 

```js
db.test.dropIndex("索引名称")
```

7. hint(key :Object) 指定索引查询

```js
db.test.find({
    name:'zhou',
    age:'23'
}).hint({
    age:1, // 指定字段为 1，代表开启该字段为优先使用的索引值。
})
// hint 用于复合索引
// 在同时拥有多个索引的情况下 mongo 会在索引表中一项一项的进行查找，按照默认顺序，如果索引表中name在前，那么就优先使用name进行索引
// 但是，在数据库中，数字索引的速度远高于字符索引，所以在海量数据查找中，可以使用 hint 指定优先使用数字索引 
```



>! 利用 TTL 集合对存储的数据进行失效时间设置 ,到达指定时间自动删除索引,
>
>mongoDB 每个集合最多64个索引值
>
>索引建立好后直接使用 `find ({name:'zhou'})`查询索引字段就行了,

**注意**

- 数据不超万条时，不需要使用索引。性能的提升并不明显，而大大增加了内存和硬盘的消耗。
- 查询数据超过表数据量30%时，不要使用索引字段查询。实际证明会比不使用索引更慢，因为它大量检索了索引表和我们原表。
- 数字索引，要比字符串索引快的多，在百万级甚至千万级数据量面前，使用数字索引是个明确的选择。
- 把你经常查询的数据做成一个内嵌数据（对象型的数据），然后集体进行索引

#### 全文索引

1. db.test.ensureIndex({conText:'text' })  使用text关键词来代表全文索引 

```js
db.test.find({
    $text:{
        $search:"\"站点信息\"非我"， // 使用 反斜杠转义查询多个字段
    }
})
```



## 状态返回与安全



​	



## mongoDB 管理

> mongodb 默认给用户使用的是最高权限的账号，但是这样会造成使用上的数据不安全性。
>
> 所以我们有必要为数据库创建权限用户

1. db.createUser()

```js
db.createUser({
    user:'zhoulicjhap',
    pwd:'725361',
    customData:{
        name:'州吏曹',
        email:'54554155@qq.com',
        age:23,
    },
    roles:[
        {
            role:"readWrite", // 开发权限
            db:'diff' // 该仓库
        },
        "read" // 所有库开放权限
    ]
})
```

1. 数据库用户角色：read、readWrite；
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin;
3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManage；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
6. 超级用户角色：root
7. 内部角色：__system



2. 查看用户

```js
db.system.users.find()
```

3. 删除用户

```js
db.system.users.remove({
    name:'zhouo'
})
```

4. 鉴权

```js
db.auth('name','password')
```

启MongoDB服务器，然后设置必须使用建权登录。 

```js
mongod --auth
```

启动后，用户登录只能用用户名和密码进行登录 

5. 登录

```js
mongom  -u username -p password 127.0.0.1:27017/admin
```









