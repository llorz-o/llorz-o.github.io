---
title: PHP入门
date: 2019-07-13
tags:
 - 后端
 - PHP
 - 入门
 - 全部
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
    
    header('content-type:text/html;charset=utf-8');
	// 确保输出的文字字符集正确
    
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

## 变量

### global

使用global访问全局变量

```php
    $x = 10;
    function Test(){
    	global $x,$y; // 如果不使用global ，那么这里的$x相当于在函数内部声明了一个局部变量；
        $y = 23
        echo $x;
	}

$GLOBALS['y']; // 也可以使用这种方式获取全局变量
```

### Static

static 关键字生命的变量在函数执行完毕后会保存状态；

```php
function Test(){
    static $x = 0;
    echo $x;
    $x ++;
}
Test(); // 0
Test(); // 1
```

## 类型比较

![UTOOLS1563442255954.png](http://yanxuan.nosdn.127.net/6353e0c2377951297976bde3075a606a.png)

## 常量

常量是全局的

```php
define('NAME','张'[,bool $case_insensitive ]);
// $case_insensitive 默认为false，即区分大小写

// php5.3.0以后，可以使用const关键字在类定义的外部定义常量
const NAME = 'names';
```

## String

### PHP_EOL

该常量为换行符；

`echo PHP_EOL;`

### 数值拼接

```php
$txt = 'hello';
echo $txt . 'world'; // 使用 . （点）拼接
```

### strlen() 获取字符长度

```php
echo strlen('hello'); // 对于英文输出5个字符,但是中文的一个字被识别为两个字符长度
echo mb_strlen('我叫麻花疼','utf-8'); // 5个字符
```

### strpos() 查找字符

```php
echo strpos('hello world','hello');
// 找到则返回第一子匹配的字符位，否则返回false
```

## 运算符

### xor 异或

```php
x xor y;
// x 和 y 有且仅有一个为 true，则返回 true
```

### 三目运算

```php
true ? 1 : 2;
$put = true?: 2; // 为true 则直接输出 true，PHP 5.3+ 版本写法
true ?? 2; // PHP7+ 版本
```

### 组合比较符

```php
$put = 1 <=> 2;
/*
如果 $a > $b, 则 $c 的值为 1。
如果 $a == $b, 则 $c 的值为 0。
如果 $a < $b, 则 $c 的值为 -1
*/
```

## 数组

```php
$arr = array(1,2,3);
$arr = array(
'key' => 'value',
);

// 5.4 起可以使用 []
$arr = [1,3,4]
```

### 遍历

```php
$arl = count($arr); // 获取数组的长度

for($i = 0;$i < $arl; $i ++){
    pass;
}

for($arl as $k => $v){
    pass;
}
// foreach 循环用于遍历数组。
foreach($arr as $v){
    pass;
}
```

### 排序

- sort() - 对数组进行升序排列
- rsort() - 对数组进行降序排列
- asort() - 根据关联数组的值，对数组进行升序排列
- ksort() - 根据关联数组的键，对数组进行升序排列
- arsort() - 根据关联数组的值，对数组进行降序排列
- krsort() - 根据关联数组的键，对数组进行降序排列

## 超全局变量

- $GLOBALS
- $_SERVER
- $_REQUEST
- $_POST
- $_GET
- $_FILES
- $_ENV
- $_COOKIE
- $_SESSION

### $_SERVER

| 元素/代码                       | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| $_SERVER['PHP_SELF']            | 当前执行脚本的文件名，与 document root 有关。例如，在地址为 http://example.com/test.php/foo.bar 的脚本中使用 $_SERVER['PHP_SELF'] 将得到 /test.php/foo.bar。__FILE__ 常量包含当前(例如包含)文件的完整路径和文件名。 从 PHP 4.3.0 版本开始，如果 PHP 以命令行模式运行，这个变量将包含脚本名。之前的版本该变量不可用。 |
| $_SERVER['GATEWAY_INTERFACE']   | 服务器使用的 CGI 规范的版本；例如，"CGI/1.1"。               |
| $_SERVER['SERVER_ADDR']         | 当前运行脚本所在的服务器的 IP 地址。                         |
| $_SERVER['SERVER_NAME']         | 当前运行脚本所在的服务器的主机名。如果脚本运行于虚拟主机中，该名称是由那个虚拟主机所设置的值决定。(如: www.runoob.com) |
| $_SERVER['SERVER_SOFTWARE']     | 服务器标识字符串，在响应请求时的头信息中给出。 (如：Apache/2.2.24) |
| $_SERVER['SERVER_PROTOCOL']     | 请求页面时通信协议的名称和版本。例如，"HTTP/1.0"。           |
| $_SERVER['REQUEST_METHOD']      | 访问页面使用的请求方法；例如，"GET", "HEAD"，"POST"，"PUT"。 |
| $_SERVER['REQUEST_TIME']        | 请求开始时的时间戳。从 PHP 5.1.0 起可用。 (如：1377687496)   |
| $_SERVER['QUERY_STRING']        | query string（查询字符串），如果有的话，通过它进行页面访问。 |
| $_SERVER['HTTP_ACCEPT']         | 当前请求头中 Accept: 项的内容，如果存在的话。                |
| $_SERVER['HTTP_ACCEPT_CHARSET'] | 当前请求头中 Accept-Charset: 项的内容，如果存在的话。例如："iso-8859-1,*,utf-8"。 |
| $_SERVER['HTTP_HOST']           | 当前请求头中 Host: 项的内容，如果存在的话。                  |
| $_SERVER['HTTP_REFERER']        | 引导用户代理到当前页的前一页的地址（如果存在）。由 user agent 设置决定。并不是所有的用户代理都会设置该项，有的还提供了修改 HTTP_REFERER 的功能。简言之，该值并不可信。) |
| $_SERVER['HTTPS']               | 如果脚本是通过 HTTPS 协议被访问，则被设为一个非空的值。      |
| $_SERVER['REMOTE_ADDR']         | 浏览当前页面的用户的 IP 地址。                               |
| $_SERVER['REMOTE_HOST']         | 浏览当前页面的用户的主机名。DNS 反向解析不依赖于用户的 REMOTE_ADDR。 |
| $_SERVER['REMOTE_PORT']         | 用户机器上连接到 Web 服务器所使用的端口号。                  |
| $_SERVER['SCRIPT_FILENAME']     | 当前执行脚本的绝对路径。                                     |
| $_SERVER['SERVER_ADMIN']        | 该值指明了 Apache 服务器配置文件中的 SERVER_ADMIN 参数。如果脚本运行在一个虚拟主机上，则该值是那个虚拟主机的值。(如：someone@runoob.com) |
| $_SERVER['SERVER_PORT']         | Web 服务器使用的端口。默认值为 "80"。如果使用 SSL 安全连接，则这个值为用户设置的 HTTP 端口。 |
| $_SERVER['SERVER_SIGNATURE']    | 包含了服务器版本和虚拟主机名的字符串。                       |
| $_SERVER['PATH_TRANSLATED']     | 当前脚本所在文件系统（非文档根目录）的基本路径。这是在服务器进行虚拟到真实路径的映像后的结果。 |
| $_SERVER['SCRIPT_NAME']         | 包含当前脚本的路径。这在页面需要指向自己时非常有用。__FILE__ 常量包含当前脚本(例如包含文件)的完整路径和文件名。 |
| $_SERVER['SCRIPT_URI']          | URI 用来指定要访问的页面。例如 "/index.html"。               |

## 魔术常量

- \__LINE__ 代码所在行
- \__FILE__  文件的完整路径和文件名 
- \__DIR__  文件所在的目录 
- \__FUNCTION__  函数名称 
- \__CLASS__ 类的名称 
- \__TRAIT__
- \__METHOD__ 类的方法名（PHP 5.0.0 新加） 
- \__NAMESPACE___ 当前命名空间的名称（区分大小写）。此常量是在编译时定义的（PHP 5.3.0 新增）。 

## 命名空间

```php
// 一个文件中命名空间需要声明在所有其他代码之前
//在声明命名空间之前唯一合法的代码是用于定义源文件编码方式的 declare 语句。所有非 PHP 代码包括空白符都不能出现在命名空间的声明之前。
declare(encoding='utf-8');

namespace at_one;

namespace project{
    // 推荐使用这种方式声明
}

namespace{
    // 这是全局的，全局的非命名空间中的代码与命名空间中的代码组合在一起
}
```

### 子命名空间

```php
namespace MyProject\Sub\Level;  //声明分层次的单个命名空间
```

### 命名空间别名

```php
namespace foo;
use my\full\classname as another;

use \ArrayObject;// 导入一个全局类

use 
    My\Full\Classname as Another, 
	My\Full\NSname; // 一次导入多个
```

```php
可以把非限定名称类比为文件名（例如 comment.php）、.限定名称类比为相对路径名（例如 ./article/comment.php）、完全限定名称类比为绝对路径名（例如 /blog/article/comment.php），这样可能会更容易理解。

再添一例：

<?php 
//创建空间Blog
namespace Blog;
class Comment { }
//非限定名称，表示当前Blog空间
//这个调用将被解析成 Blog\Comment();
$blog_comment = new Comment();
//限定名称，表示相对于Blog空间
//这个调用将被解析成 Blog\Article\Comment();
$article_comment = new Article\Comment(); //类前面没有反斜杆\
//完全限定名称，表示绝对于Blog空间
//这个调用将被解析成 Blog\Comment();
$article_comment = new \Blog\Comment(); //类前面有反斜杆\
//完全限定名称，表示绝对于Blog空间
//这个调用将被解析成 Blog\Article\Comment();
$article_comment = new \Blog\Article\Comment(); //类前面有反斜杆\

//创建Blog的子空间Article
namespace Blog\Article;
class Comment { }
?>
```

## 面向对象

```php
class Site{
    /**
     * 使用var 和 public 定义的都属于公开的成员边量（可任意访问）
     * 使用 private 定义私有的成员变量，只能被定义的所在类访问
     * 使用 protected 定义保护成员，受保护成员可被自身及其子类，父类访问
     * 后两种亦不能为实例访问，即只可在类的内部执行
     */
    var $url,
        $title,
        $name;
    private $gender;
    protected $money;

    //成员函数
    function setUrl($par){
        $this->url = $par;
    }
    function getUrl(){
        return $this->url;
    }
    // 构造函数
    function __construct($name)
    {
        $this->name = $name;
    }
    /* 
    析构函数
    当对象结束其生命周期时（例如对象所在的函数已调用完毕），系统自动执行析构函数。
     */
    function __destruct(){
        //
    }
}

// PHP 不支持多继承
class Address extends Site{
    /**
     * override (重写)， 一般是子类对父类同种方法的增强或修改（据业务不同）
     *  重写应当与父类具有更少的错误，因为它是对父类相同方法的扩展
     *  重写的特点是一般只能重写一次，同名的方法与参数，返回值，但是逻辑不同
     * 
     * overload (重载)， 在一个类中有多个名称相同，参数值不同的方法被称为重载。
     *  这种方式用于提高方法的复用性，减少不必要的api，收束方法的功能。
     * 重载的特点是方法名相同，参数不同，返回值也可不同，逻辑也有差异，但是依据参数来确定
     */

    function getUrl(){
        return $this->url;
    }
}
```

### 接口

```php
<?php

header('content-type:text/html;charset=utf-8');

/**
 * 接口中定义的所有方法都必须是公有
 * 接口规定实现该接口的类需要实现所有该接口规定的方法
 */
interface iTemplate
{
    function setVariable($name, $val);
}
interface iTemplate2
{
    function setNames($name);
}

class Site
{

    var $url,
        $title,
        $name;

    function setUrl($par)
    {
        $this->url = $par;
    }
    function getUrl()
    {
        return $this->url;
    }
}

// implements 操作符 逗号分隔多个接口的名称

class Address extends Site implements iTemplate, iTemplate2
{
    function getUrl()
    {
        return $this->url;
    }
    function setVariable($name, $val)
    { }
    function setNames($name)
    { }
}

```

### 抽象类

```php
<?php

header('content-type:text/html;charset=utf-8');

/**
 *  任何一个类，如果它里面至少有一个方法是被声明为抽象的，那么这个类就必须被声明为抽象的。
 *  定义为抽象的类不能被实例化,只可被继承。
 *  继承一个抽象类的时候，子类必须定义父类中的所有抽象方法；
 */
abstract class AbstractParent{
    abstract protected function getValue($key);
}

class Children extends AbstractParent{
    /**
     * 这些方法的访问控制必须和父类中一样（或者更为宽松）。例如某个抽象方法被声明为受保护的，
     * 那么子类中实现的方法就应该声明为受保护的或者公有的，而不能定义为私有的。
     */
    function getValue($key,$v2='default'){ // 子类可以定义父类中不存在的可选参数,注意只是可选参数，
        return "{$key}-Children-{$v2}";
    }
}

```

### Static

```php
class ParentClass{
    /**
     * 通过static关键字修饰的静态属性或方法是与类直接关联的，所以$this在静态方法中不可访问。
     * 但是self关键字指向该类，可进行调用
     */
    static $name = 'zo';

    function showName(){
        echo self::$name;
    }
}

$foo = new ParentClass;
echo ParentClass::$name; 
echo $foo->showName();
```

### Final

```php
// PHP 5 新增了一个 final 关键字。如果父类中的方法被声明为 final，则子类无法覆盖该方法。如果一个类被声明为 final，则不能被继承。
class ParentClass{

    final function showName(){
        echo 'fianl';
    }

}

class ChildrenClass extends ParentClass{

    function showName(){
        echo 'ChildrenClass'; // error :: Cannot override final method ParentClass::showName()
    }

} 
```

### 调用父类的构造方法

```php
class ParentClass{
    var $name;
    function __construct($name){
        $this->name = $name;
    }
}

class ChildrenClass extends ParentClass{
    var $val;
    /**
     *  如果子类没有写构造则默认调用父类的构造，如写了构造需要parent调用
     */
    function __construct($name,$val)
    {
        parent::__construct($name);
        $this->val = $val;
    }
} 

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

## 文件导入 include & require

```php
// require 允许多次导入,但会重复执行被载入文件
require 'conf';

// require_once 多次导入但只导入一次
require_once 'conf';

// include 导入失败时不报错，一般用于页面模块的导入
include 'conf';

include_once // 同上
```

## 文件上传

在`php.ini`内修改单个文件大小限制

![UTOOLS1563266089496.png](http://yanxuan.nosdn.127.net/40deaec23d2d9eb8d491087e9f29f467.png)

还有`post`提交上限大小

![UTOOLS1563266192512.png](http://yanxuan.nosdn.127.net/6371470b4f6dcf2d805f09ac6b0d2df2.png)

```php
 <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post" enctype="multipart/form-data" accept="audio/mp3,audio/wma">
        <?php
        echo isset($error) ? $error : ''
        ?>
        <input type="file" name="file_upload">
        <input type="submit" value="提交">
    </form>
```

## 扩展内容

### date 日期

```php
// 要获得准确的时间，需要在文件头设置时区。
date_default_timezone_set("PRC"); 
// 第二个值为可选时间戳
echo date('Y-m-d'[,timestamp);
```

| `format`字符         | 说明                                                         | 返回值例子                                                   |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| *日*                 | ---                                                          | ---                                                          |
| *d*                  | 月份中的第几天，有前导零的 2 位数字                          | *01* 到 *31*                                                 |
| *D*                  | 星期中的第几天，文本表示，3 个字母                           | *Mon* 到 *Sun*                                               |
| *j*                  | 月份中的第几天，没有前导零                                   | *1* 到 *31*                                                  |
| *l*（"L"的小写字母） | 星期几，完整的文本格式                                       | *Sunday* 到 *Saturday*                                       |
| *N*                  | ISO-8601 格式数字表示的星期中的第几天（PHP 5.1.0 新加）      | *1*（表示星期一）到 *7*（表示星期天）                        |
| *S*                  | 每月天数后面的英文后缀，2 个字符                             | *st*，*nd*，*rd* 或者 *th*。可以和 *j* 一起用                |
| *w*                  | 星期中的第几天，数字表示                                     | *0*（表示星期天）到 *6*（表示星期六）                        |
| *z*                  | 年份中的第几天                                               | *0* 到 *365*                                                 |
| *星期*               | ---                                                          | ---                                                          |
| *W*                  | ISO-8601 格式年份中的第几周，每周从星期一开始（PHP 4.1.0 新加的） | 例如：*42*（当年的第 42 周）                                 |
| *月*                 | ---                                                          | ---                                                          |
| *F*                  | 月份，完整的文本格式，例如 January 或者 March                | *January* 到 *December*                                      |
| *m*                  | 数字表示的月份，有前导零                                     | *01* 到 *12*                                                 |
| *M*                  | 三个字母缩写表示的月份                                       | *Jan* 到 *Dec*                                               |
| *n*                  | 数字表示的月份，没有前导零                                   | *1* 到 *12*                                                  |
| *t*                  | 给定月份所应有的天数                                         | *28* 到 *31*                                                 |
| *年*                 | ---                                                          | ---                                                          |
| *L*                  | 是否为闰年                                                   | 如果是闰年为 *1*，否则为 *0*                                 |
| *o*                  | ISO-8601 格式年份数字。这和 *Y* 的值相同，只除了如果 ISO 的星期数（*W*）属于前一年或下一年，则用那一年。（PHP 5.1.0 新加） | Examples: *1999* or *2003*                                   |
| *Y*                  | 4 位数字完整表示的年份                                       | 例如：*1999* 或 *2003*                                       |
| *y*                  | 2 位数字表示的年份                                           | 例如：*99* 或 *03*                                           |
| *时间*               | ---                                                          | ---                                                          |
| *a*                  | 小写的上午和下午值                                           | *am* 或 *pm*                                                 |
| *A*                  | 大写的上午和下午值                                           | *AM* 或 *PM*                                                 |
| *B*                  | Swatch Internet 标准时                                       | *000* 到 *999*                                               |
| *g*                  | 小时，12 小时格式，没有前导零                                | *1* 到 *12*                                                  |
| *G*                  | 小时，24 小时格式，没有前导零                                | *0* 到 *23*                                                  |
| *h*                  | 小时，12 小时格式，有前导零                                  | *01* 到 *12*                                                 |
| *H*                  | 小时，24 小时格式，有前导零                                  | *00* 到 *23*                                                 |
| *i*                  | 有前导零的分钟数                                             | *00* 到 *59*>                                                |
| *s*                  | 秒数，有前导零                                               | *00* 到 *59*>                                                |
| *u*                  | 毫秒 （PHP 5.2.2 新加）。需要注意的是 **date()** 函数总是返回 *000000* 因为它只接受 integer 参数， 而 DateTime::format() 才支持毫秒。 | 示例: *654321*                                               |
| *时区*               | ---                                                          | ---                                                          |
| *e*                  | 时区标识（PHP 5.1.0 新加）                                   | 例如：*UTC*，*GMT*，*Atlantic/Azores*                        |
| *I*                  | 是否为夏令时                                                 | 如果是夏令时为 *1*，否则为 *0*                               |
| *O*                  | 与格林威治时间相差的小时数                                   | 例如：*+0200*                                                |
| *P*                  | 与格林威治时间（GMT）的差别，小时和分钟之间有冒号分隔（PHP 5.1.3 新加） | 例如：*+02:00*                                               |
| *T*                  | 本机所在的时区                                               | 例如：*EST*，*MDT*（【译者注】在 Windows 下为完整文本格式，例如"Eastern Standard Time"，中文版会显示"中国标准时间"）。 |
| *Z*                  | 时差偏移量的秒数。UTC 西边的时区偏移量总是负的，UTC 东边的时区偏移量总是正的。 | *-43200* 到 *43200*                                          |
| *完整的日期／时间*   | ---                                                          | ---                                                          |
| *c*                  | ISO 8601 格式的日期（PHP 5 新加）                            | 2004-02-12T15:19:21+00:00                                    |
| *r*                  | RFC 822 格式的日期                                           | 例如：*Thu, 21 Dec 2000 16:01:07 +0200*                      |
| *U*                  | 从 Unix 纪元（January 1 1970 00:00:00 GMT）开始至今的秒数    | 参见 time()                                                  |

### 文件读写

```php
$txt = fopen(str:path[,str:mode])
```

| 模式 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| r    | 只读。在文件的开头开始。                                     |
| r+   | 读/写。在文件的开头开始。                                    |
| w    | 只写。打开并清空文件的内容；如果文件不存在，则创建新文件。   |
| w+   | 读/写。打开并清空文件的内容；如果文件不存在，则创建新文件。  |
| a    | 追加。打开并向文件末尾进行写操作，如果文件不存在，则创建新文件。 |
| a+   | 读/追加。通过向文件末尾写内容，来保持文件内容。              |
| x    | 只写。创建新文件。如果文件已存在，则返回 FALSE 和一个错误。  |
| x+   | 读/写。创建新文件。如果文件已存在，则返回 FALSE 和一个错误。 |

**注释：**如果 fopen() 函数无法打开指定文件，则返回 0 (false)。 

```php
$file = fopen('readme.md','r');

/**
 * 在 w 、a 和 x 模式下，无法读取打开的文件！
 */
if(feof($file)){
    echo '文件末尾';
}

while(!feof($file)){
    echo fgets($file).'</br>'; // 逐行读文件
    echo fgetc($file); // 逐字符读文件
}

fclose($file); // 关闭文件
```

### Cookie

```php
/**
 * 在发送 cookie 时，cookie 的值会自动进行 URL 编码，在取回时进行自动解码。
 * （为防止 URL 编码，请使用 setrawcookie() 取而代之。）
 * cookie 一般设置在文件头，
 * 下级路径的cookie不能被上级路径访问
 */
var_dump($_COOKIE);

if (isset($_COOKIE['user'])) { // cookie 存在否
    
	echo "欢迎" . $_COOKIE['user'];
    
} else {
	echo '普通人';
    // 写入 cookie 键 值 过期时间 生效路径
	setcookie('user', 'zhoulichao', time() + 3600, '/');
}

```

### session

Session 的工作机制是：为每个访客创建一个唯一的 id (UID)，并基于这个 UID 来存储变量。UID 存储在 cookie 中，或者通过 URL 进行传导。 

```php

session_start();

$_SESSION['views'] = 'session_view-1';

// 删除某些 session 数据，可以使用 unset() 或 session_destroy() 函数。
```

### 异常捕获

```php
try{
    throw new Exception('err')
}catch(Exception $e){
    echo '错误{$e}'
}

// set_exception_handler() 函数可设置处理所有未捕获异常的用户定义函数。
function myException($exception)
{
    echo "<b>Exception:</b> " , $exception->getMessage();
}
 
set_exception_handler('myException');
 
throw new Exception('Uncaught Exception occurred');
```

### 过滤器

- filter_var() - 通过一个指定的过滤器来过滤单一的变量
- filter_var_array() - 通过相同的或不同的过滤器来过滤多个变量
- filter_input - 获取一个输入变量，并对它进行过滤
- filter_input_array - 获取多个输入变量，并通过相同的或不同的过滤器对它们进行过滤

```php
if(!filter_var($int, FILTER_VALIDATE_INT))
{
    echo("不是一个合法的整数");
}
else
{
    echo("是个合法的整数");
}
```

