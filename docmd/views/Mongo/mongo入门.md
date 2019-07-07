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

## 索引

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
db.test.getIndexes()
```

4. totalIndexSize() 查看集合索引大小 

```js
db.test.totalIndexSize()
```

5. dropIndexes() 删除所有索引

```js
db.test.dropIndexes()	
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
>索引建立好后直接使用 `find ({name:'zhou'})`查询索引字段就行了.
>
>因为普通查询默认包含 _id 字段，如果在普通查询和索引查询具有相同字段时禁用 _id 字段，就会导致普通查询被索引查询所覆盖。这样能提高查询速度
>
>多使用 [explain ](#explain())检测是否能使用索引

### 全文索引

1. db.test.ensureIndex({conText:'text' })  使用text关键词来代表全文索引 

```js
db.test.find({
    $text:{
        $search:"\"站点信息\"非我"， // 使用 反斜杠转义查询多个字段
    }
})
```

### 索引限制

- 数据不超万条时，不需要使用索引。性能的提升并不明显，而大大增加了内存和硬盘的消耗。
- 查询数据超过表数据量30%时，不要使用索引字段查询。实际证明会比不使用索引更慢，因为它大量检索了索引表和我们原表。
- 数字索引，要比字符串索引快的多，在百万级甚至千万级数据量面前，使用数字索引是个明确的选择。
- 把你经常查询的数据做成一个内嵌数据（对象型的数据），然后集体进行索引
- 索引储存在内存，所以索引不应超过内存大小
- 索引不能被一下查询使用
  - 正则表达式，非操作符，$nin,\$not..
  - 算数运算符 $mod..
  - $where 子句
- 索引名的长度不能超过128个字符
- 一个复合索引最多可以有31个字段

## 聚合

1. aggregate()

```js
db.diff.aggregate([{
    $group:{
        _id:'$name',
        count:{
            $sum:1
        }
    }
}])
// 
```

**聚合表达式**

| 表达式    | 描述                                           | 实例                                                         |
| --------- | ---------------------------------------------- | ------------------------------------------------------------ |
| $sum      | 计算总和。                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| $avg      | 计算平均值                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| $min      | 获取集合中所有文档对应值得最小值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| $max      | 获取集合中所有文档对应值得最大值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| $push     | 在结果文档中插入值到一个数组中。               | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}]) |
| $addToSet | 在结果文档中插入值到一个数组中，但不创建副本。 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}]) |
| $first    | 根据资源文档的排序获取第一个文档数据。         | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}]) |
| $last     | 根据资源文档的排序获取最后一个文档数据         | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}]) |

## 管道符

1. $project 修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。 

```js
var rs = db.runoob.aggregate({
    $project:{
        title:1,
        author:1
    }
})

// 输出这两个字段的值， 注意 _id 为默认输出
_id:0, // 可关闭id的默认输出
```

2. $match：用于过滤数据，只输出符合条件的文档。match使用MongoDB的标准查询操作。

```js
var rs = db.runoob.aggregate([ // 注意这里的数组，有多个限制条件时，使用数组
    {
        $match:{
            likes:{
                $gt:70, //大于
                $lte:200, // 小于等于
            }
        }
    },
    {
        $group:{
            _id:'$by_user',
            count:{
                $sum:1
            }
        }
    }
])
// 多个限制条件下，由数组中第一个限制条件返回的结果，进入第二个限制条件
```

3. $limit  用来限制MongoDB聚合管道返回的文档数。 

```js
var rs = db.runoob.aggregate({
    $skip:1
})
```

4. $unwind 将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。 

```js
var rs = db.runoob.aggregate({
    $unwind:'tags'
})
// 这在检索文章的标签时非常有用
```

5. $group 将集合中的文档分组，可用于统计结果。 

```js
db.diff.aggregate([{
    $group:{
        _id:'$name', // 按name属性进行分组
        count:{
            $sum:1, // 统计分组数量
        }
    }
}])
```

6. $sort  输入文档排序后输出 

```js
var rs = db.runoob.aggregate({
    $sort:{
        likes:1
    }
})
```

7. $geoNear  输出接近某一地理位置的有序文档。

```js

```

8. 时间聚合

```js
var rs = db.runoob.aggregate([
    {$match:{m_id:10001,mark_time:{$gt:new Date(2017,8,0)}}},
    {$group: {
       _id: {$dayOfMonth:'$mark_time'},
        pv: {$sum: 1}
        }
    },
    {$sort: {"_id": 1}}
])
```

时间关键字如下：

-  $dayOfYear: 返回该日期是这一年的第几天（全年 366 天）。
-  $dayOfMonth: 返回该日期是这一个月的第几天（1到31）。
-  $dayOfWeek: 返回的是这个周的星期几（1：星期日，7：星期六）。
-  $year: 返回该日期的年份部分。
-  $month： 返回该日期的月份部分（ 1 到 12）。
-  $week： 返回该日期是所在年的第几个星期（ 0 到 53）。
-  $hour： 返回该日期的小时部分。
-  $minute: 返回该日期的分钟部分。
-  $second: 返回该日期的秒部分（以0到59之间的数字形式返回日期的第二部分，但可以是60来计算闰秒）。
-  $millisecond：返回该日期的毫秒部分（ 0 到 999）。
-  $dateToString： { $dateToString: { format: , date: } }。

## 复制（副本集）

> 复制可保障数据安全性，让数据具有高可用性，具有灾难恢复，无需停机维护，分布式读取数据的优点

> 副本集是具有N个节点的集群，任何节点都可作为主节点，所有的写入操作都在主节点上，然后与副本集进行数据同步。副本集对故障能进行自动转移，自动恢复。

```shell
mongod --port 29077 --dbpath "C:\data\fb01" --replSet fb01
# 启动端口号为 29077 名为 fb01（副本01） 的mongoDB实例
mongo --port 29077
# 连接到 29077 端口副本集
rs.initiate()
# 启动新的副本集
rs.conf()
# 查看副本集的配置
rs.status()
# 查看副本集状态
```

### 创建副本集

```shell
mongod --port 29077 --dbpath "C:\data\fb01" --replSet fb01
mongod --port 29078 --dbpath "C:\data\fb02" --replSet fb01

mongo --port 29077

config = {
    _id:'fb01', # 副本集名称，多个副本的名称需要保持一致
    members:[
        {
            _id:0,
            host:'localhost:29077', # fb01
        },
        {
            _id:1,
            host:'localhost:29078', # fb01
        },
    ]
}

rs.initiate(config)
# 使用配置 初始化 副本集
{
        "ok" : 1,
        "operationTime" : Timestamp(1562401664, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1562401664, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}

fb01:PRIMARY> rs.conf()
# 查看副本集状态
{
        "_id" : "fb01",
        "version" : 1,
        "protocolVersion" : NumberLong(1),
        "writeConcernMajorityJournalDefault" : true,
        "members" : [ 		# 成员
                {
                        "_id" : 0,
                        "host" : "localhost:29077",
                        "arbiterOnly" : false,
                        "buildIndexes" : true,
                        "hidden" : false,
                        "priority" : 1,
                        "tags" : {

                        },
                        "slaveDelay" : NumberLong(0),
                        "votes" : 1
                },
                {
                        "_id" : 1,
                        "host" : "localhost:29078",
                        "arbiterOnly" : false,
                        "buildIndexes" : true,
                        "hidden" : false,
                        "priority" : 1,
                        "tags" : {

                        },
                        "slaveDelay" : NumberLong(0),
                        "votes" : 1
                }
        ],
        "settings" : {
                "chainingAllowed" : true,
                "heartbeatIntervalMillis" : 2000,
                "heartbeatTimeoutSecs" : 10,
                "electionTimeoutMillis" : 10000,
                "catchUpTimeoutMillis" : -1,
                "catchUpTakeoverDelayMillis" : 30000,
                "getLastErrorModes" : {

                },
                "getLastErrorDefaults" : {
                        "w" : 1,
                        "wtimeout" : 0
                },
                "replicaSetId" : ObjectId("5d205b80e6d0fbe7d5626d81")
        }
}

fb01:PRIMARY> rs.isMaster()
# 查看当前副本 是否为主节点
{
        "hosts" : [
                "localhost:29077",
                "localhost:29078"
        ],
        "setName" : "fb01",
        "setVersion" : 1,
        "ismaster" : true,
        "secondary" : false,
        "primary" : "localhost:29077",
        "me" : "localhost:29077",
        "electionId" : ObjectId("7fffffff0000000000000001"),
        "lastWrite" : {
                "opTime" : {
                        "ts" : Timestamp(1562401906, 1),
                        "t" : NumberLong(1)
                },
                "lastWriteDate" : ISODate("2019-07-06T08:31:46Z"),
                "majorityOpTime" : {
                        "ts" : Timestamp(1562401906, 1),
                        "t" : NumberLong(1)
                },
                "majorityWriteDate" : ISODate("2019-07-06T08:31:46Z")
        },
        "maxBsonObjectSize" : 16777216,
        "maxMessageSizeBytes" : 48000000,
        "maxWriteBatchSize" : 100000,
        "localTime" : ISODate("2019-07-06T08:31:56.201Z"),
        "logicalSessionTimeoutMinutes" : 30,
        "minWireVersion" : 0,
        "maxWireVersion" : 7,
        "readOnly" : false,
        "ok" : 1,
        "operationTime" : Timestamp(1562401906, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1562401906, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}

# 接着打开 从库 的shell面板
mongo --port 29078
rs.isMaster()
{
        "hosts" : [
                "localhost:29077",
                "localhost:29078"
        ],
        "setName" : "fb01",
        "setVersion" : 1,
        "ismaster" : false, # 非主节点
        "secondary" : true, # 副节点
        "primary" : "localhost:29077",
        "me" : "localhost:29078",
        "lastWrite" : {
                "opTime" : {
                        "ts" : Timestamp(1562402086, 1),
                        "t" : NumberLong(1)
                },
                "lastWriteDate" : ISODate("2019-07-06T08:34:46Z"),
                "majorityOpTime" : {
                        "ts" : Timestamp(1562402086, 1),
                        "t" : NumberLong(1)
                },
                "majorityWriteDate" : ISODate("2019-07-06T08:34:46Z")
        },
        "maxBsonObjectSize" : 16777216,
        "maxMessageSizeBytes" : 48000000,
        "maxWriteBatchSize" : 100000,
        "localTime" : ISODate("2019-07-06T08:34:51.857Z"),
        "logicalSessionTimeoutMinutes" : 30,
        "minWireVersion" : 0,
        "maxWireVersion" : 7,
        "readOnly" : false,
        "ok" : 1,
        "operationTime" : Timestamp(1562402086, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1562402086, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}
# 现在你直接 使用 show dbs 会报错
rs.slaveOk()
# 执行从库 的初始化
# 现在开始你在主库写入数据，从库也能实时同步了
```

![mongodb主从副本集](http://yanxuan.nosdn.127.net/c3a740c6db2fc234a4e78af7933bc001.png)



### 配置主从权重

```bash
# 注意需要在主库上操作
cfg = rs.conf()
cfg.members[0].priority = 2
cfg.members[1].priority = 1
rs.reconfig(cfg)
```

## 分片

分片配置

```shell
Shard 1:27001 # 存储实际的数据块
Shard 2:27002
Shard 3:27003
# 3.4 版本以后 config 必须为 集群
Config Server:27000 conf01 # mongod实例,存储了整个集群元数据，包括分块信息
Config Server:27222 conf01
Route Process:30000 # 前端路由，客户端由此接入
```

创建Shard Server (分片服务)

```shell
mongod --port 27001 --dbpath=c:\data\shard\s1
mongod --port 27002 --dbpath=c:\data\shard\s2
mongod --port 27003 --dbpath=c:\data\shard\s3
```

[*config servers*](http://www.mongoing.com/docs/core/sharded-cluster-config-servers.html)：配置服务器存储群集的元数据和配置设置。从MongoDB 3.4开始，必须将配置服务器部署为副本集（CSRS） *参考官网文档*

创建 Config Server 副本集

```shell
mongod --port 27000 --dbpath "c:\data\shard\config\fb01" --replSet fb01
mongod --port 27222 --dbpath "c:\data\shard\config\fb02" --replSet fb01
mongo --port 27000
config = {
    _id:'fb01',
    member:[
        {
            _id:0,
            host:'localhost:27000',
        },
         {
            _id:1,
            host:'localhost:27222',
        },
    ]
}
rs.initiate(config)
mongo --port 27222
rs.slaveOk()
mongos --port 30000 --configdb fb01/localhost:27000,localhost:27222
mongo --port 30000 # ok 进行到这一步的时候卡壳了。。。
# 关于错误，截至我写到这里时仍没有一个好的解决方法
```

## 备份与恢复

### 备份

```shell
# 备份之前记得打开服务 mongo
mongodump -h localhost:27017 -d test -o c:\data\dump\test
# -h 服务器地址
# -d 数据库实例
# -o 备份的数据输出目录
```

|         描述         |                        实例                         |
| :------------------: | :-------------------------------------------------: |
|     备份所有数据     |       mongodump --host localhost --port 27017       |
| 指定数据输出指定目录 | mongodump --dbpath c:\data\db --out c:\data\dump\db |
| 备份指定数据库的集合 |        mongodump --collection diff --db test        |

### 恢复

```shell
# mongorestore -h <hostname><:port> -d dbname <path>
# <path> 设置备份数据所在位置
# --drop 用备份数据替换当前数据
# --dir 指定备份的目录，无法同时指定<path> 和 --dir
```

## 监控

1. mongostat  查看mongo状态
2. mongotop <sleeptime> 提供每个集合的水平的统计数据 

```js
// sleeptime 是每次数据的间隔
// --locks 这个是报告每个数据库的锁的使用中状态，需要数据库具有锁状态
```



## 状态返回与安全

普通数据库操作方法并没有任何的状态返回，用户无法得知修改的结果。

**因此在实际使用中应该采用应答式方法。**

```js
db.diff.insert({
    name:'zhou',
    text:'feafeafea',
})
var resultState = db.runCommand({
    getLastError:1
})
printjson(resultState)
// => 
/*

{
        "connectionId" : 1,
        "updatedExisting" : true,
        "n" : 2,
        "syncMillis" : 0,
        "writtenTo" : null,
        "err" : null,
        "ok" : 1
}

*/
```

1. db.listCommands( )  查看所有的Commad命令 
2. findAndModify 查找并修改 

```js
var modify = {
    findAndModify:'diff',
    query:{
        name:'zhou',
    },
    update:{
        $set:{
            age:23
        }
    },
    new:true // 更新完成，true 为查看结果，flase 反之
}

var rs = db.runCommand(modify)

/*

query：需要查询的条件/文档
sort: 进行排序
remove：[boolean]是否删除查找到的文档，值填写true，可以删除。
new:[boolean]返回更新前的文档还是更新后的文档。
fields：需要返回的字段
upsert：没有这个值是否增加

*/
```

## mongoDB 用户群

> mongodb 默认给用户使用的是最高权限的账号，但是这样会造成使用上的数据不安全性。
>
> 所以我们有必要为数据库创建权限用户

1. db.createUser()

```js
// 你需要先进入 admin 文档
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
// count 修饰符
db.system.users.find().count()
// or pretty()
db.system.users.find().pretty()
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
mongo -u username -p password 127.0.0.1:27017/admin
// 注意，一定要先连接至 admin
```

用户名`zlc`密码`725361`

## 数据库关系

### 嵌入式关系

```js
var user = [
    {
        name:'zhou',
        address:[
            {
                countries:'china',
                province:'hu bei',
                city:'wu han',
                area:'hong shan'
            },{
                countries:'china',
                province:'hu bei',
                city:'huang gang',
                area:'ma cheng'
            }
        ]
    }
]
```

这样会产生的问题是数据无法重用，数据量会一直增长，影响读写性能

### 引用式关系

```js
var user = [
    {
        name:'zhou',
        address:[
            ObjectId('52ffc4a5d85242602e000000'),
            ObjectId('52ffc4a5d85242602e000001')
        ]
    }
]
```

将用户信息和地址分文档储存，通过引用id建立关系

## 数据库引用

### DBRefs

`{ $ref: <集合名>, $id:<引用id> , $db:<可选，数据库名>  }`

```js
var user = {
    name:'zhou',
    address:{
        $ref:'address',
        $id:ObjectId('52ffc4a5d85242602e000000'),
        $db:'other'
    }
}
```

## 查询分析

### explain()

explain 操作提供了查询信息，使用索引及查询统计等。有利于我们对索引的优化 

```shell
 db.runoob.find({     likes:10 },{     title:1,     _id:0 }).explain()
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "test.runoob",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "likes" : {
                                "$eq" : 10
                        }
                },
                "winningPlan" : {
                        "stage" : "PROJECTION",
                        "transformBy" : {
                                "title" : 1,
                                "_id" : 0
                        },
                        "inputStage" : {
                                "stage" : "COLLSCAN",
                                "filter" : {
                                        "likes" : {
                                                "$eq" : 10
                                        }
                                },
                                "direction" : "forward"
                        }
                },
                "rejectedPlans" : [ ]
        },
        "serverInfo" : {
                "host" : "DESKTOP-700R2G4",
                "port" : 27017,
                "version" : "4.0.4",
                "gitVersion" : "f288a3bdf201007f3693c58e140056adf8b04839"
        },
        "ok" : 1
}
```

- **indexOnly**: 字段为 true ，表示我们使用了索引。
- **cursor**：因为这个查询使用了索引，MongoDB 中索引存储在B树结构中，所以这是也使用了 BtreeCursor 类型的游标。如果没有使用索引，游标的类型是 BasicCursor。这个键还会给出你所使用的索引的名称，你通过这个名称可以查看当前数据库下的system.indexes集合（系统自动创建，由于存储索引信息，这个稍微会提到）来得到索引的详细信息。
- **n**：当前查询返回的文档数量。
- **nscanned/nscannedObjects**：表明当前这次查询一共扫描了集合中多少个文档，我们的目的是，让这个数值和返回文档的数量越接近越好。
- **millis**：当前查询所需时间，毫秒数。
- **indexBounds**：当前查询具体使用的索引。

### hint() 参照索引篇 hint

## 原子操作

参照 [状态返回与安全](#状态返回与安全) 这一章，使用 findAndModify() 方法确保修改的有效性，该方法返回修改的状态确保我们知道修改的成功与否，因为它的修改是同步的，这与sql的事务机制本质上要达到的功能是一样的。

**原子操作命令**一般出现在update中

```js
db.users.findAndModify({
    query:{
        age:{
            $gt:18
        }
    },
    update:{
        $push:{
            tags:'未成年'
        }
    }
})
```



1. $set  对指定key更新value

`$set:{key:value}`

2. $unset 删除key对应的键值对

`$unset:{key:value}`

3. $inc 对value为数字的value进行增减

`$inc:{age:1}`

4. $push 追加到数组，如果没有则创建数组

`$push:{key:value}`

5. $pushAll 追加多个值到数组 (**不可用**)

`$pushAll:{key:array}`

6. $pull 在数组中删除一个和value相等的值

`$pull:{key:value}`

7. $addToSet 当value不存在于key的数组中，添加这个value

`$addToSet:{key:value}`

8. $pop 删除数组第一个或最后一个，-1删除第一个，1删除最后一个

`$pop:{key:1 or -1}`

9. rename 给key换一个字段

`$rename:{key:new_key}`

10. $ 代量 修改数组中的对象的属性

```js
comments:[
    {
        count:21
    },
    {
        count:25
    }
]
```

`$inc:{'comments.$.count':1}`

## ObjectId

ObjectId 是一个12字节 BSON 类型数据，有以下格式：

- 前4个字节表示时间戳
- 接下来的3个字节是机器标识码
- 紧接的两个字节由进程id组成（PID）
- 最后三个字节是随机数

`new_objec_id = new ObjectId()`手动生成ObjectId

`ObjectId('5349b4ddd2781d08c09890f4').getTimestamp()` 返回创建时间

`new ObjectId().str` 返回guid字符串

## Map Reduce

![map reduce](http://yanxuan.nosdn.127.net/f2cc5c392d7433da5bf52c7d82ece122.png)

```js
{ "_id" : ObjectId("5d221002ea2c383a764c0d26"), "id" : 116, "amount" : "100.00", "balance" : "100.00", "create_time" : "2019-07-03 11:43:30", "status" : null, "change_type" : 10 }
{ "_id" : ObjectId("5d221002ea2c383a764c0d27"), "id" : 117, "amount" : "300.00", "balance" : "400.00", "create_time" : "2019-07-03 11:44:15", "status" : null, "change_type" : 10 }
{ "_id" : ObjectId("5d221002ea2c383a764c0d28"), "id" : 118, "amount" : "300.00", "balance" : "700.00", "create_time" : "2019-07-03 11:45:14", "status" : null, "change_type" : 10 }
{ "_id" : ObjectId("5d221002ea2c383a764c0d29"), "id" : 129, "amount" : "5000.00", "balance" : "5700.00", "create_time" : "2019-07-03 14:12:28", "status" : null, "change_type" : 10 }

db.time.mapReduce(
    function(){
        emit(this.id,1) // => 
        /*
        
        {
        	116:[1]
        },
        {
        	117:[1]
        }
        ...
        */
    },
    function(k,v){
        /*
        {
            _id:116, // 如果该key下有多个值时也只取第0个下标
            value:1
        }
        */
        return Array.sum(v)
    },
    {
        query:{
            status:null, // 查询所有
        },
        out:'time_total'
    }
).find() // =>
//result
{ "_id" : 116, "value" : 1 }
{ "_id" : 117, "value" : 1 }
{ "_id" : 118, "value" : 1 }
{ "_id" : 129, "value" : 1 }

```

