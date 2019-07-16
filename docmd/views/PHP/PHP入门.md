---
title: PHP入门
date: 2019-07-13
tags:
 - 后端
 - PHP
 - 入门
categories: 
 - 后端
---

# PHP

## Apache安装&卸载

下载[apache](https://www.apachelounge.com/download/)

```powershell
# 解压到纯英文路径
# 例如： d:\DevelopmentSoftware\apache\
# 进入 apache的 bin 目录
# 安装 apache 服务，-n 参数指定服务器名称
$ httpd.exe -k install -n "Apache"
# 打开行窗口键入 services.msc 打开服务窗口，好吧目前不知道作用
# 卸载命令
$ httpd.exe -k uninstall -n "Apache"
```

### conf/httpd.conf apache配置文件:notebook:

打开至 37 行发现如下

```shell
# ServerRoot:服务器所在的目录树的顶部
# 保存配置、错误和日志文件。
#
# 不要在目录路径的末尾添加斜杠。如果你点
# 在非本地磁盘上指定一个本地磁盘
# 如果使用基于文件的互斥锁，则使用互斥锁指令。如果你想分享
# 对于多个httpd守护进程，您需要在相同的ServerRoot上进行更改
# PidFile最少。
# Define SRVROOT 定义一个常量，为apache默认安装路径
Define SRVROOT "c:/Apache24"
# 改为目前安装路径 Define SRVRROOT "D:\DevelopmentSoftware\apache\Apache24"
ServerRoot "${SRVROOT}"
# 最新的apache有以上变量，老版本的建议修改所有的默认目录为目前安装目录
```

- `httpd -t `测试配置文件

  ![1551521322607](http://yanxuan.nosdn.127.net/53cdba1212b4833e2dd2f48bf7c53f32.png)

- 这个警告可以忽略，不忽略则设置服务器名称
- ![1551521546791](http://yanxuan.nosdn.127.net/ecbd80714bd64ed7c921bc89cb42d59d.png)

![1551521711036](http://yanxuan.nosdn.127.net/4668f3172bbae0c25e412d22f61e4c96.png)

- 取消掉注释改为你想要的服务路径

  ```shell
  ServerName localhost
  ```

- 再次测试基本上就没有问题

##  Apache 启动等命令

```powershell
# 以管理员权限运行 shell 命令行工具
$ httpd -k start -n "Apache"
# 重启
$ httpd -k restart -n "Apache"
# 停止
$ httpd -k stop -n "Apache" 

```

## hosts

```tex
C:\Windows\System32\drivers\etc
# 该路径为 hosts 文件所在地
# hosts 文件映射端口号
```

**netstat -an 查看本机端口占用情况**

- `netstat-ano|findstr '80'`加端口号，记住进程PID并打开任务管理器。
- 找到对应的PID结束进程即可。

http 默认占用 80 端口

https 默认占用 443 端口

**services.msc** 打开服务管理

## Apache配置

### 监听端口

打开**httpd.conf** 文件

```powershell
# 占用端口，可配置多个
Listen 8080
# 例 Listen 8032
```

### Apache服务器根目录

```shell
# 在httpd.conf 配置
DocumentRoot "D:\WWW"
<Directory "${SRVROOT}/htdocs">
# 现在localhost 根目录指向 d:/www 的目录了
```

![1551527218993](http://yanxuan.nosdn.127.net/4c2f78604df9ab55fed8ff013d85bea5.png)

![1551527265665](http://yanxuan.nosdn.127.net/bde3db762993c384a51a4510d49b5a5a.png)

**Error** 

![1551527502760](http://yanxuan.nosdn.127.net/8e517a859241b94f0dc7eac1a31a9926.png)

注意下面的 Directory 为允许磁盘访问，必须同样修改该目录。这是由于安全原则，apache在上方禁用所有的根目录访问，然后你必须指定你需要暴露的路径

```shell
# 禁用所有的目录访问权
<Directory />
    AllowOverride none
    Require all denied
</Directory>
# 指定根目录
DocumentRoot "D:\WWW"
# 开启该目录访问权限
<Directory "D:\WWW">
	 Options Indexes FollowSymLinks
	 AllowOverride None
	 Require all granted
</Directory>
```

### 默认文档

当客户端访问一个目录时，服务端默认返回该目录下的某个文件

配置文件 httpd.conf （默认文档可配置多个，由前置后依次寻找，若没有找到任何一个匹配的则启用目录浏栏）

```shell
<IfModule dir_module>
    DirectoryIndex index.html index.php # 后面依次添加
</IfModule>
```

![1551529016637](http://yanxuan.nosdn.127.net/139facf7e54a978a46ba05cf02543f7e.png)

**注意** 不要让客户端看到你的网站结构

```shell
//找到这一项 ，删除indexs，就不会展现文档结构
Options Indexes FollowSymLinks
```

### 虚拟主机

在 httpd.conf 找到 

```shell
# Virtual hosts
#Include conf/extra/httpd-vhosts.conf
# 取消include 注释，开启虚拟主机
```

按上方路径找到 `httpd-vhosts.conf` 文件

```shell
# *:80 监听任意 IP 的 80 端口
# 由于多个虚拟主机一同工作，所以每一个虚拟主机必须配置 ServerName（访问域名）
<VirtualHost *:80>
	# 网站出问题会显示 ServerAdmin 的邮箱地址，方便用户回复错误
    ServerAdmin webmaster@dummy-host2.example.com
    # 网站根目录
    DocumentRoot "D:\WWW"
    # 访问域名
    ServerName test1.com
    # 别名，多个域名访问同一个网站可以写在别名上（该项可以删除）
    ServerAlias www.dummy-host.example.com
    # 错误日志
    ErrorLog "logs/dummy-host2.test1.com-error.log"
    # 自定义日志
    CustomLog "logs/dummy-host2.test1.com-access.log" common
</VirtualHost>
```

**如果配置了虚拟主机，那么服务器不会走默认主机的设定**

**这里如果你配置了 Listen 为 8080 端口 ，那么虚拟主机只有访问8080端口才会生效，因为该端口为apache监听端口**

配置多个虚拟主机，倘若虚拟主机目录不在 WWW 里面也会造成 磁盘无访问权限，所以我们可以为虚拟主机设置磁盘根目录访问权限

```shell
<VirtualHost *:80>
    # 网站出问题会显示 ServerAdmin 的邮箱地址，方便用户回复错误
    #ServerAdmin webmaster@dummy-host2.example.com
    # 网站根目录
    DocumentRoot "D:\test2"
    # 使用directory 保证该目录访问
    <Directory "D:\test2">
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
   </Directory>
    # 访问域名
    ServerName test2.acs
    # 别名，多个域名访问同一个网站可以写在别名上（该项可以删除）
    #ServerAlias www.dummy-host.example.com
    # 错误日志
    ErrorLog "logs/test2.acs-error.log"
    # 自定义日志
    CustomLog "logs/test2.acs-access.log" common
</VirtualHost>
```



## PHP 基本

下载安装解压至英文路径

在httpd.conf配置apache对php支持

```shell
# PHP 处理模块
# 该模块根据 MIME TYPE 判断，需要添加 type 支持
LoadModule php7_module D:/DevelopmentSoftware/php/php-5.5.38/php5apache2_4.dll
# 在php5 的版本在php根目录下可找到 php5apache2_4.dll 文件，按以上方式添加

# 搜索 mimemodule ，添加php mime
AddType application/x-http-php .php .html .htm
```

![1551536559393](http://yanxuan.nosdn.127.net/cd7894a5fee755a3b7dcefed4a9b1bb5.png)

![1551536704046](http://yanxuan.nosdn.127.net/f3acc8bf56cd0c82a32dc6023b103cb1.png)

### Hello world !

```php
<?php echo 'Hello world'; ?>
```

> 如果php没有混编代码（没有与html代码写在一起）可以不写结束标记，这样可以避免额外产生的空格。

### PHP输出内容的方式

- echo

```php

<?php
    //echo 可以不用 （）输出
    echo 'hello';
	echo 'hello','world'
        
```

- print

```php
<?php
print 'nihao' //只能输出一个参数
```

- var_dump()

```php
//一般用于调试，可输出数据和数据类型
var_dump('nihao')
```

- 指令式语句

```php+HTML
<!-- 1. 普通嵌入 -->
<p><?php echo 'hello'; ?></p>

<!-- 语句混编 -->
<?php if($age >= 18){ ?>
<p> 成年人 </p>
<?php }else {?>
<p> 小朋友 </p>
<?php } ?> <!-- 这种方式写起来难看，不好认，易出错 -->

<!-- 推荐使用这种 -->
<?php if($age >= 18): ?>
    <p>成年人</p>
 <?php else: ?>
    <p>小朋友</p>
 <?php endif ?>

```

## PHP扩展

找到`php.ini`文件，如果没有那就是使用`php.ini-development`,或`php.ini-production`作为模板创建一个。将`php.ini`文件备份，创建一个新的`php.ini`找到`extension_dir` 字段，该字段为模块引入路径字段，取消注释，并将路径指向为php的模块所在路径：根目录下的`ext`文件夹

**php配置文件注释为 ；号开头**

![UTOOLS1563035111638.png](http://yanxuan.nosdn.127.net/346f4a56c96c21c3afdefe103c9dd2dc.png)

找到你需要的模块，取消注释

![UTOOLS1563035164479.png](http://yanxuan.nosdn.127.net/2cd1a2fd83e67bc0a448fd952fd30dca.png)

`php`配置文件`apache`默认启用路径为`c:/window`目录，将`php.ini`丢到该目录下。

如果不是该目录，打开php的配置信息网站查看正确的路径。

或是自己配置配置文件导入目录

![UTOOLS1563036094637.png](http://yanxuan.nosdn.127.net/802e82a72ea2c3c388c7a9c23127d2a0.png)

上面是在`httpd.conf`配置文件下配置

在`phpstudy`中配置文件被外部导入到`httpd.conf`中了

![1563036183860](C:\Users\17517\AppData\Local\Temp\1563036183860.png)

查看`conf/extra/httpd-php.conf`文件

![UTOOLS1563036255077.png](http://yanxuan.nosdn.127.net/cc18c0df7a8c39f47e245694e9a522d9.png)

## REPL

PHP交互式命令行

将php的安装目录，`php.exe`执行文件所在目录的路径添加到环境变量path中

在`php.exe`文件所在目录打开命令行键入

`php -a`打开`php REPL`

**注意这是高版本下的`REPL`打开方式**

## 文件导入

```php
// require 允许多次导入,但会重复执行被载入文件
require 'conf';

// require_once 多次导入但只导入一次
require_once 'conf';

// include 导入失败时不报错，一般用于页面模块的导入
include 'conf';

include_once // 同上
```



