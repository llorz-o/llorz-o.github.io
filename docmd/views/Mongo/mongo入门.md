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

