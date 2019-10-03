---
title: Laravel
date: 2019-09-02
tags: 
 - PHP
 - 后端
 - 入门
 - 全部
categories: 
 - 后端
---
# 准备

1. Composer `php`包管理器
2. 命名空间 作为后端框架模块划分是必需搞清楚不可的
3. [Trait](https://laravelacademy.org/post/4281.html)
4. Docker 虽不是必学的,但是非常的香
# 安装

使用`Composer create project` 安装

```bash
composer create-project laravel/laravel blog --prefer-dist
```

```bash
composer install
```

ERROR 1

![UTOOLS1568028547215.png](http://yanxuan.nosdn.127.net/f58c830b1067cf974ff193365f7277ab.png)

打开`php.ini`文件

`O:\Dev_soft\phpStudy\PHPTutorial\php\php-7.2.1-nts\php.ini`

找到`extension=php_fileinfo.dll` 取消注释

ERROR 2

访问路径无效果

在`vhosts.conf`文件添加虚拟主机配置

```txt
<VirtualHost *:80>
     ServerName laravelht.vn
     DocumentRoot "O:/Test_Project/blog/public"
     SetEnv APPLICATION_ENV "development"
     <Directory "O:/Test_Project/blog/public">
         DirectoryIndex index.php
         AllowOverride All
         Require all granted
         Order allow,deny
         Allow from all
     </Directory>
 </VirtualHost>
```

ERROR 3

500 server error

查看任务日志

`storage/logs`

```log
production.ERROR: No application encryption key has been specified.
```

```bash
php artisan key:generate
```

生成密钥`ok`可以访问了
# 基础
## 路由与控制器
### 路由

`php`中有两个定义路由,`routes/web.php`,`routes/api/php`

```php
// 通用的方式 可设置post update delete等其它类型
// 还有 any 任意类型,但不推荐使用
Route::get('/',function(){
    return view();
});
// 白名单 match
Route::match(['get','post'],'/',function(){});
// 复杂业务拆分到控制器中实现
Route::get('/','WelcomeController@index')
```
#### 路由传参

```php
// 路由参数
Route::get('/{id}',function($id){});
// 可选参数,默认参数
Route::get('/{id?}',function($id = 1){});
// 路由参数匹配规则
Route::get('/{id}/{num}',function($id,$num){})->where([
    'id'=>'[0-9]+',
    'num'=>'[0-9]{2,4}'
]);
```
#### 路由命名

```php+HTML
// 在view文件中 使用 url 函数将会为路由自动添加域名前缀 => 'pc.test/'
<a href="\{\{ url('/') \}\}">

// 命名式路由 使用name方法命名路由
Route::get('user/{id?}/{name}',function($id = 1){})->name('user.profile');
// 在view中使用按位传参命名路由(按位传参需要保证顺序),也可使用键值对
<a href="\{\{ route('user.profile',['id'=>100,'zhou']) \}\}">
```
### 路由分组

**按中间件分组**

```php
// 多中间件 ['auth','another']
Route::middleware('auth')->group(function(){
   Route::get('dashboard',function(){});
   Route::get('account',function(){});
});
// 老版本
Route::group(['middleware'=>'auth'],function(){});
```

**路由前缀**

```php
// 匹配以 api 开头的路由
Route::prefix('api')->group(function(){})
```

**子域名**

```php
// 使用子域名分组的情况下,account永远是分组路由中路由的第一个参数
Route:domain('{account}.blog.test')->group(function(){
    Route::get('/{id}',function($account,$id){})
});
```

**子命名空间**

以控制器方式定义路由的时候，当我们没有显式指定控制器的命名空间时，默认的命名空间是 `App\Http\Controllers`（在 `app/Providers/RouteServiceProvider.php` 中设置），如果某些控制器位于这个命名空间下的子命名空间中，我们可以通过 `Route::namespace` 为同一子命名空间下的分组路由设置共同的子命名空间：

```
Route::get('/', 'Controller@index');

Route::namespace('Admin')->group(function() {
     // App\Http\Controllers\Admin\AdminController
     Route::get('/admin', 'AdminController@index');
});
```

**路由命名前缀**

```php
Route::name('user.')->prefix('user')->group(function(){
  Route::get('/{id}',function($id){
      // 该路由同时满足 /user/{id} ,路由命名 user.show
  })->name('show');
});
```
### 控制器

控制器的主要职责就是获取`HTTP`请求,进行简单的处理将其传递给真正的业务逻辑职能`Service`.

```bash
php artisan make:controller TaskController
```

在`app/Http/Controllers` 会出现一个 `TaskController.php` 文件

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
	//Route::get('/task','TaskController@home')
    // 没有指定完整的命名空间,web.php所有的控制器都位于app/Http/Controllers命名空间下
	public function home(){
		// return 'hello world';
        // 以下为常用控制器操作,通过Task::all() 查询所有任务数据(Task模型并未创建)
        // 将其赋值给tasks变量在resources/views/task/index.blade.php 中渲染
		return view('index')->with('tasks',Task::all());
	}
}
```
#### 客户端输入

这里是采用依赖注入的方式获取用户的输入并保存到`$task`模型中,日常开发中也推荐使用依赖注入的方式获取用户输入,包括`COOKIE`,`SESSION`等.

```php
public function store(Request $request){
		$task = new Task(); // 注意这个Task对象并没有实现
		$task->title = $request->input('title');
		$task->description = $request->input('description');
		$task->save();
		return redirect('task');
}
```
#### 资源控制器

键入命令生成`app/Http/Controllers/PostController.php`文件.

```bash
php artisan make:controller PostController --resource
```

**资源控制器方法列表**

以上 `PostController` 控制器的每个方法都有对应的请求方式、路由命名、URL、方法名和业务逻辑约定。

| HTTP请求方式 | URL            | 控制器方法 | 路由命名    | 业务逻辑描述                 |
| :----------- | :------------- | :--------- | :---------- | :--------------------------- |
| GET          | post           | index()    | post.index  | 展示所有文章                 |
| GET          | post/create    | create()   | post.create | 发布文章表单页面             |
| POST         | post           | store()    | post.store  | 获取表单提交数据并保存新文章 |
| GET          | post/{post}    | show()     | post.show   | 展示单个文章                 |
| GET          | post/{id}/edit | edit()     | post.edit   | 编辑文章表单页面             |
| PUT          | post/{id}      | update()   | post.update | 获取编辑表单输入并更新文章   |
| DELETE       | post/{id}      | destroy()  | post.desc   | 删除单个文章                 |

**绑定资源服务器**

通过上面的表格已经了解了 Laravel 中对资源路由的命名约定，Laravel 还为我们提供了一个 `Route::resource` 方法用于一次注册包含上面列出的所有路由，并且遵循上述所有约定：

```php 
Route::resource('post', 'PostController');
```

通过`php artisan route:list `查看所有路由

![UTOOLS1567493655327.png](https://user-gold-cdn.xitu.io/2019/9/3/16cf5e7153c6036e?w=1054&h=286&f=png&s=50223)

编写`PostController.php`

```php
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
		//
		return 'Post' . $id . 'Link' . route('post.show',[$id]);
    }
```

直接访问`http://blog.test/post/1`,得到

```txt
Post1Linkhttp://blog.test/post/1
```
### 路由进阶
#### 路由模型绑定

定义特殊参数名告知路由解析器根据给定资源ID查询模型,并将查询结果作为参数传入.

**隐式绑定**

```php
Route::get('task/{task}',function(\App\Models\Task $task){
	dd($task);
});
```

路由参数与方法参数一样,且约定`\App\Model\Task`类型的`$task`,该路由就会被识别为路由模型绑定.

路由绑定默认将传入的`{task}`参数值作为模型主键ID进行查询,可通过在模型类中重写`getRouteKeyName()`来实现自定义查询字段.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public function getRouteKeyName() {
        return 'name';  // 以任务名称作为路由模型绑定查询字段
    }
}
```

**显式绑定**

显式绑定需要手动配置路由模型绑定，通常需要在 `App\Providers\RouteServiceProvider` 的 `boot()` 方法中新增如下这段配置代码：

``` php
public function boot()
{
    // 显式路由模型绑定
    Route::model('task_model', Task::class);

    parent::boot();
}
```

编写完这段代码后，以后每次访问包含 `{task_model}` 参数的路由时，路由解析器都会从请求 URL 中解析出模型 ID ，然后从对应模型类 `Task` 中获取相应的模型实例并传递给闭包函数或控制器方法：

```php
Route::get('task/model/{task_model}', function (\App\Models\Task $task) {
    dd($task); // 打印
});
```

由于在正式开发中，出于性能的考虑通常会对模型数据进行缓存，此外在很多情况下，需要关联查询才能得到我们需要的结果，所以并不建议过多使用这种路由模型绑定。
#### 兜底路由

用于访问路由不存在时的处理逻辑,相当于 `* `任意路由(不使用兜底路由默认将返回404)

使用兜底路由的好处是我们可以对这类请求进行统计并进行一些自定义的操作，比如重定向，或者一些友好的提示什么的，兜底路由可以通过 `Route::fallback` 来定义：

```php
Route::fallback(function () {
    return '我是最后的屏障';
});
```
#### 访问频率

可设计限制用户失败尝试次数减少爬虫的频繁访问，流量高峰期限流

```php
Route::middleware('throttle:60,1')->group(function(){
    // 一分钟能只能访问路由分组的内路由（如 /user）60 次
});
Route::middleware('throttle:rate_limit,1')->group(function () {
    // 通过被访问路由涉及到的模型定义属性(rate_limit)来动态定义路由的访问限制频率
});
```

**路由缓存提升性能不大,且牺牲了闭包路由,得不偿失**
### 表单方法伪造 CSRF保护

- OPTIONS：允许客户端查看服务器的性能。这个方法会请求服务器返回该资源所支持的所有 HTTP 请求方法，该方法会用'*'来代替资源名称，向服务器发送 OPTIONS 请求，可以测试服务器功能是否正常。JavaScript 的 XMLHttpRequest 对象进行 CORS 跨域资源共享时，就是使用 OPTIONS 方法发送嗅探请求，以判断是否有对指定资源的访问权限。
- GET：请求指定的页面信息，并返回响应实体。一般来说 GET 方法应该只用于数据的读取，而不应当用于会产生副作用的非幂等的操作中。
- HEAD：与GET方法一样，都是向服务器发出指定资源的请求，但是服务器在响应 HEAD 请求时不会回传资源的内容部分（即响应实体），这样我们在不传输全部内容的情况下，就可以获取服务器的响应头信息。HEAD方法常被用于客户端查看服务器的性能。
- POST：向指定资源提交数据，请求服务器进行处理，如：表单数据提交、文件上传等，请求数据包含在请求体中。POST 方法是非幂等的方法，因为这个请求可能会创建新的资源或修改现有资源。
- PUT：向指定资源位置上传其最新内容，PUT 方法是幂等的方法。通过该方法客户端可以将指定资源的最新数据传送给服务器取代指定的资源的内容，常用于修改指定资源。
- DELETE：请求服务器删除所请求 URI 所标识的资源。DELETE 请求后指定资源会被删除，DELETE 方法也是幂等的。
- TRACE：请求服务器回显其收到的请求信息，该方法主要用于 HTTP 请求的测试或诊断。
- CONNECT：该方法是 HTTP/1.1 协议预留的，能够将连接改为管道方式的代理服务器。通常用于 SSL 加密服务器的链接与非加密的 HTTP 代理服务器的通信。
- PATCH：出现的较晚，它在 2010 年的 RFC 5789 标准中被定义。PATCH 请求与 PUT 请求类似，同样用于资源的更新。二者有以下两点不同：1、PATCH 一般用于资源的部分更新，而 PUT 一般用于资源的整体更新；2、当资源不存在时，PATCH 会创建一个新的资源，而 PUT 只会对已在资源进行更新。

**表单方法伪造**

```php+HTML
<form action="/task/1" method="POST"> 
    <input type="hidden" name="_method" value="DELETE"> 
</form>
```

该请求将被识别为`Route:delete`路由,HTML表单仅支持`GET/POST`请求

**CSRF保护**

为了安全考虑，Laravel 期望所有路由都是「只读」操作的（对应请求方式是 GET、HEAD、OPTIONS），如果路由执行的是「写入」操作（对应请求方式是 POST、PUT、PATCH、DELETE），则需要传入一个隐藏的 Token 字段（`_token`）以避免[跨站请求伪造攻击]（CSRF）

```php
Route::get('task/{id}/delete', function ($id) {
	return '<form method="post" action="' . route('task.delete', [$id]) . '">
	<input type="hidden" name="_method" value="DELETE">
	<button type="submit">删除任务</button>
</form>';
});

Route::delete('task/{id}', function ($id) {
	return 'Delete Task' . $id;
})->name('task.delete');
```

**排除指定 URL 不做 CSRF 保护**

对于应用中某些第三方回调路由，如第三方登录或支付回调，无法做 Token 校验，需要将这些授信路由排除在 CSRF 校验之外
## view & blade tpl
### view

视图文件位于`resources/views`目录下,多级目录以`.`分隔,且引用文件不带后缀

```php
// resources/views/user/profile.blade.php
Route::get('user/{id}',function($id){
	return view('user.profile',['id'=>$id]);
})->name('user.profile');
```
#### 视图与参数

```php
return view('home',['tasks'=>Task:all()]); // 推荐
return view('home')->with('tasks',Task:all());
```
#### 视图共享变量

```php
view()->share('Name','jojo');
// 然后就可以在任何视图文件中访问共享变量.
```
### Blade模板

1. `\{\{  \}\}` 这种占位符下的输出内容会被`htmlentities`进行HTML字符转义(可避免XSS)
2. `\{\{!!  !!\}\}`  不转义直接输出
3. `@` 逻辑控制
4. `@\{\{  \}\}`编译时移除`@`,保留双花括弧,方便兼容类似`vue`的语法
5. `\{\{-- 注释 --\}\}`
#### 控制语句

**@if、@else、@elseif**

Blade 模板中的 `@if` 等价于 PHP 的 `<?php if ($condition):`，`@else` 和 `@elseif` 依次类推，最后以一个 `@endif`收尾：

```
@if (count($students) === 1) 
    操场上只有一个同学
@elseif (count($students) === 0)
    操场上一个同学也没有
@else
    操场上有 \{\{ count($students) \}\} 个同学
@endif
```

和原生 PHP 中的用法如出一辙。

**@unless**

`@unless` 是 Blade 提供的一个 PHP 中没有的语法，用于表示和 `@if` 条件相反的条件，`@unless($condition)` 可以理解为 `<?php if (!$condition):`，然后以 `@endunless` 收尾：

```
@unless ($user->hasPaid()) 
    用户没有支付
@endunless
```

**@isset、@empty**

这两个指令和 PHP 中的 `isset()` 和 `empty()` 方法等价：

```
@isset($records)
    // 记录被设置
@endisset

@empty($records)
    // 记录为空
@endempty
```

后面两个都是语法糖，如果你不想记太多东西，不防都用 `@if` 来实现对应的逻辑了。

**@switch**

顾名思义，Blade 中的 `@switch` 指令和 PHP 中的 `switch` 语句等价，我们可以通过 `@switch`、`@case`、`@break`、`@default` 和 `@endswitch` 指令构建对应逻辑：

```
@switch($i)
    @case(1)
        // $i = 1 做什么
        @break

    @case(2)
        // $i = 2 做什么
        @break

    @default
        // 默认情况下做什么
@endswitch
```
#### 循环结构

**@for、@foreach 和 @while**

和 PHP 一样，在 Laravel 中，我们可以通过与之等价的 `@for`、`@foreach` 和 `@while` 实现循环控制结构，使用语法和 PHP 代码相仿：

```
// for 循环
@for ($i = 0; $i < $talk->slotsCount(); $i++) 
    The number is \{\{ $i \}\}<br> 
@endfor

// foreach 循环
@foreach ($talks as $talk)
    \{\{ $talk->title \}\} (\{\{ $talk->length \}\} 分钟)<br> 
@endforeach

// while 循环  
@while ($item = array_pop($items)) 
    \{\{ $item->orSomething() \}\}<br> 
@endwhile
```

**@forelse**

这个指令是 PHP 中具备的，可以理解为处理以下 PHP 代码逻辑：

```
<?php 
if ($students) {
    foreach ($students as $student) {
       // do something ...
    }
} else {
    // do something else ...
}
```

在 Blade 模板中我们可以使用 `@forelse` 指令通过以下代码实现上述逻辑：

```
@forelse ($students as $student)
    // do something ...
@empty
    // do something else ...
@endforelse    
```

**@foreach 和 @forelse 中的 $loop 变量**

在循环控制结构中，我们要重磅介绍的就是 Blade 模板为 `@foreach` 和 `@forelse` 循环结构提供的 `$loop` 变量了，通过该变量，我们可以在循环体中轻松访问该循环体的很多信息，而不用自己编写那些恼人的面条式代码，比如当前迭代索引、嵌套层级、元素总量、当前索引在循环中的位置等，`$loop` 实例上有以下属性可以直接访问：

![UTOOLS1568112412512.png](http://yanxuan.nosdn.127.net/1aac33a7da4d1abeca7948df16852925.png)

下面是一个简单的使用示例：

```
<ul> 
@foreach ($pages as $page)
    @if ($loop->first)
        // 第一个循环迭代
    @endif 
    <li>\{\{ $loop->iteration \}\}: \{\{ $page->title \}\} 
        @if ($page->hasChildren()) 
        <ul> @foreach ($page->children() as $child) 
            <li>\{\{ $loop->parent->iteration \}\}. \{\{ $loop->iteration \}\}: \{\{ $child->title \}\}</li> 
            @endforeach 
        </ul> 
        @endif 
    </li> 
    @if ($loop->last)
        // 最后一个循环迭代
    @endif
@endforeach 
</ul>
```
### 模板继承 & 组件引入
#### @yield @section/@show

模板 master

```php
<!-- resources/views/template/tpl.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<!-- \@yield 指定需要子视图继承实现的内容区,第二参数为子视图未实现时的默认值 -->
	<title>模板master | @yield('title','首页')</title>
</head>
<body>
	<div class="contaienr">
		@yield('content')
	</div>
	@section('masterFooter')
	<!-- \@section/\@show也用于指定子视图需要继承实现的内容区块,也提供默认区块内容 -->
	<!-- \@section/\@show 指定的默认子视图可通过 \@parent访问 \@yield 的默认内容对子视图不可见 -->
		<div class="footer">
			master footer
		</div>
	@show
</body>
</html>
```
#### @extends @section/@endsection

子模板 testTpl

```php
<!-- resources/views/testTpl.blade.php -->
@extends('template.tpl') // 指定被继承模板 目录以 . 分隔,模板文件需要位于 resources/views 中

@section('title','testTpl') // 简单的区块内容可以以第二参数形式传入

@section('content')
	testTpl container->content
@endsection

@section('masterFooter')
	@parent
	testTpl Footer
@endsection

```
#### @include

```php
<!-- resources/views/login-btn.blade.php -->
<a class="login-btn" >
	<i class="exclamation-icon">\{\{ $text \}\}</i>
</a>
```

导入组件并传参,视图中的被导入组件可引用视图中的变量,但是不推荐,因为被多个视图引用容易引起混乱

```php
@include('template.login-btn',['text'=>'组件按钮'])
```
#### @each

``` php+HTML
<!-- resources/views/sidebar.blade.php --> 
<div class="sidebar">
    @each('partials.module', $modules, 'module', 'partials.empty-module') 
</div>

<!-- resources/views/partials/module.blade.php --> 
<div class="sidebar-module">
    <h1>\{\{ $module->title \}\}</h1> 
</div> 

<!-- resources/views/partials/empty-module.blade.php --> 
<div class="sidebar-module">
    No modules :( 
</div>
```

`@each` 指令支持多个参数，第一个参数用于指定要循环引入的组件名，第二个参数是要遍历的集合变量，第三个参数是在引入组件中使用的变量名（对应 `$modules` 集合中单个元素），最后一个参数是集合数据为空时引入的默认组件
#### @slot @component

和`vue`的插槽一样

```php+HTML
<!-- /resources/views/alert.blade.php -->
<div class="alert alert-danger">
    <h1>
        \{\{$title\}\}
    </h1>
    \{\{ $slot \}\}
</div>
```

通过`@component`

```php+HTML
@component('alert',[
	'title'=>$title
])
    <strong>哎呦!</strong> 出错啦!
@endcomponent 
```
#### View Composer

由于单个组件可能在多个视图中引入,不可能为每个视图都传输一边组件需要的数据,遵循相同即为冗余(rong yu)的原则

```php
view()->composer('partials.siderbar',function($view){
    $view->with('posts',Post::recent());
});
// 通过数组指定多个视图组件
view()->composer(['partials.header', 'partials.footer'], function ($view) { 
    $view->with('posts', Post::recent()); 
});

// 通过通配符指定多个视图组件
view()->composer('partials.*', function ($view) { 
    $view->with('posts', Post::recent()); 
});
```

或者通过自定义类实现更加灵活的[数据预设](https://laravelacademy.org/post/9664.html)
#### 视图注入

通过服务注入指令`@inject`在视图模板中注入服务,和`view composer`一样都是为了避免重复传值

```php+HTML
@inject('analytics','App\Services\Anlytics')
<div>
    \{\{ $analytics->getData() \}\}
</div>
```

其原理就是将注册到服务容器中的服务解析出来，然后就可以调用该服务提供的方法：

```php
$analytics = app('App\Services\Analytics');
```

但是不推荐视图与业务逻辑混用
#### 自定义blade指令

和 View Composer 一样，需要在 `AppServiceProvider` 的 `boot` 方法中注册这个指令

```php
Blade::directive('datetime', function($expression) {
    return "<?php echo ($expression)->format('Y/m/d H:i:s'); ?>";
});
```

第一个参数是方法名，第二个参数是一个闭包函数，用于定义指定实现逻辑。这样，我们就可以在视图模板中通过 `@datetime($time)` 指令统一显示指定格式的日期时间了。

> 注：更新完 Blade 指令逻辑后，必须删除所有的 Blade 缓存视图指令才能生效。缓存的 Blade 视图可以通过 Artisan 命令 `view:clear` 移除。


## Laravel 前端

Laravel集成了vue开发环境

在入口blade文件中添加vue入口文件

```php+html
<!-- csrf 是必须的 -->
<meta name="csrf-token" content="\{\{ csrf_token() \}\}">
<div id="app">
	<example-component></example-component>
</div>
<script src="js/app.js"></script>
```

此外Laravel添加了一些基本的工具,在axios中也默认添加了`X-CSRF-TKEN`请求头.

![UTOOLS1567574380715.png](https://user-gold-cdn.xitu.io/2019/9/4/16cfab6e22587ab3?w=898&h=150&f=png&s=25759)

Laravel vue 支持sass语法(奇葩的是laravel并不支持vue组件的全局scss导入),你只能通过以下方式导入.

```js
//  webpack.mix.js
mix.js('resources/js/app.js', 'public/js')
	.sass('resources/sass/app.scss', 'public/css')
	.webpackConfig({
		resolve:{
			alias:{
				'@':path.resolve('resources/sass')
			}
		}
	})

```

```scss

// 组件
@import "~@/_variables.scss";

```

> !参考[Issues 共享全局变量](https://github.com/JeffreyWay/laravel-mix/issues/2050)
### copy

`mix`提供`copy`方法,但是在拷贝目录时`copy`方法会铺平目录结构,要维持原目录结构,需要使用`copyDireactory`方法

```js

mix.copyDirectory('assets/img','public/img');

```
### version()

`mix` 提供 `version`方法附加唯一哈希到文件名,实现缓存刷新 `mix.version()`
## 请求

通过注入道控制器方法中的`Illuminate\Http\Request`对象实例,

```php
// app/Http/Controlllers/RequestController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RequestController extends Controller{

	public function form(Request $request){

	}
}
```

可通过`$request->all()`获取所有的请求数据

通过`$request->except('id')`排除指定字段

通过`$request->only(['id','site'])`获取指定字段

使用`has`或`exists`判断某个字段是否存在`$id =$request->has('id')?$request->get('id') : 0`,使用`get`方法获取字段的值,如果是`post`方法就使用`post`获取值 ; `input`方法可以从所有请求方式中获取值 ; 

```php
$site = $request->input('site','aaa'); // 第二参数为默认值,当参数site值为空
```

**获取数组的值**

```php
$request->input('arr.0'); // 下标
$request->input('arr.0.id'); // 深度取值
```

控制器中获取路由参数

```php
Rooute:get('form/{id}','RequestController@form');
// 路由参数需要放在注入参数后面
public function form(Request $request,$id){}
```

使用`$request->segment()`方法获取`$id`
### 文件上传

`$request->file()`将获取一个`Illuminate\Http\UploadFile`对象实例

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RequestController extends Controller{

	public function formPage(Request $request){
		return view('form');
	}

	public function fileUpload(Request $request){
		if($request->has('picture')){
			// dd($request->file('picture'));
			$picture = $request->file('picture');
			if(!$picture->isValid()){
				abort(400,'无效上传文件');
			}
			// 文件扩展名
			$extension = $picture->getClientOriginalExtension();
			// 文件名
			$filename = $picture->getFilename();
			//
			$new_file_name = md5($filename . time() . mt_rand(1,10000)) . '.' . $extension;
			// 图片保存路径
			$save_path = 'images/' . $new_file_name;
			// web访问路径
			$web_path = '/storage/' . $save_path;
			// 将文件保存在 storage/app/public/images 下,先判断文件是否存在,如果存在直接返回
			if(Storage::disk('public')->has($save_path)){
				return response()->json(['path'=>$web_path]);
			}
			if($picture->storePubliclyAs('images',$new_file_name,['disk'=>'public'])){
				return response()->json(['path'=>$web_path]);
			}
			abort(500,'文件上传失败');
		}else{
			abort(400,'请选择要上传的文件');
		}
	}
}

```

关于`Storage::disk()`,磁盘的配置可在`config/filesystems.php`查看

```php
<?php

return [
    'default' => env('FILESYSTEM_DRIVER', 'local'),

    'cloud' => env('FILESYSTEM_CLOUD', 's3'),

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
        ],
    ],
];

```

让上传到`storage/app/public`目录的文件可被外部访问需要执行`php artisan storage:link`

该命令会在项目根目录下的 `public` 中创建一个软链 `storage` 指向 `storage/app/public`

[Intervention Image](https://laravelacademy.org/post/3585.html)图片处理扩展包
### 表单验证

表单验证基于`ValidatesRequest`Trait中的`validate()`方法

[表单验证规则大全](https://laravelacademy.org/post/9547.html#toc_17)

```php
	public function form(Request $request){
		$this->validate($request,[
			'title'=>'bail|required|string|between:2,32',
			'url'=>'sometimes|url|max:200',
			'picture'=>'nullable|string'
		],[
			'title.required'=>'标题不为空',
			'title.string'=>'标题必须是字符串'
		]);
		return response('表单验证通过');
	}
```

通常对于表单请求验证失败时,页面会被重定向到原页面,可通过`$errors`获取错误信息

如果是`ajax`,就处理422错误码

 如果控制器没有实现`ValidatesRequest`Trait的话需要使用门面实现验证.

```php
public function form(Request $request){
		return Validator::make($request,[
			'title'=>'bail|required|string|between:2,32',
			'url'=>'sometimes|url|max:200',
			'picture'=>'nullable|string'
		],[
			'title.required'=>'标题不为空',
			'title.string'=>'标题必须是字符串'
		])->validate();
		return response('表单验证通过');
	}
```

通过`ValidatesRequest`的`make`方法最后在结尾调用`validate`方法,这样就可以在任意地方实现表单验证
### 表单请求类

在`app/Http/Requests`目录新增`SubmitFormRequest.php`文件

```bash
php artisan make:request SubmitFormRequest
```

`authorize()`方法用于验证用户权限,返回`false`表示拥护无权提交表单(抛出权限异常终止请求),这里改为`true`接收用户表单验证;在`rules()`方法中定义验证规则

```php
public function rules()
	{
		return [
			'title' => 'bail|required|string|between:2,32',
			'url' => 'sometimes|url|max:200',
			'picture' => 'nullable|string'
		];
	}
	// 重写父类message方法实现错误消息自定义
	public function messages()
	{
		return [
			'title.required' => '标题字段不能为空',
			'title.string' => '标题字段仅支持字符串',
			'title.between' => '标题长度必须介于2-32之间',
			'url.url' => 'URL格式不正确，请输入有效的URL',
			'url.max' => 'URL长度不能超过200',
		];
	}
```

将表单请求字段验证逻辑以类型提示的方式注入到请求路由对应的控制器方法就可以被执行.

如果这个请求是一个表单请求类，则会自动执行其中定义的字段验证规则对请求字段进行验证，如果验证成功则继续执行控制器中的方法，否则会抛出验证失败异常.

```php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitFormRequest;

class RequestController extends Controller{
	//SubmitFormRequest 继承自 FormRequest 继承自 Request 类
    // 所以请求参数获取也通过 $request
	public function form(SubmitFormRequest $request){
		return response('表单验证通过');
	}
```
### 数组请求验证

```php
'books' => 'required|array',   # 验证 books[]
'books.author' => 'required|max:10',  # 验证 books[author]
'books.*.author' => 'required|max:10',  # 验证 books[test][author]
```
### 自定义验证规则

```php
public function form(Request $request){
		$this->validate($request,[
			'title'=>[
				'bail',
				'required',
				'string',
				'between:2,32',
				function($attribute,$value,$fail){
					/**
					 * $attribute 字段名
					 *  $value 字段值
					 *  $fail 失败的回调函数
					 */
					if(strpos($value,'敏感词') !== false){
						return $fail('标题包含敏感词');
					}
				}
			]
		]);
		return response('表单验证通过');
	}
```
### 创建规则类自定义验证规则

在`app/Rules`创建`SensitiveWordRule.php`文件

```php
php artisan make:rule SensitiveWordRule
```

```php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class SensitiveWordRule implements Rule
{
    
    public function __construct()
    {
    }

    public function passes($attribute, $value)
    {
		return strpos($value,'敏感词') === false;
    }

    public function message()
    {	
        // 字段名会被自动注入 :attribute
        return ':attribute 输入字段中包含敏感词';
    }
}

```

```php
$this->validate($request,[
			'title'=>[
				'bail',
				'required',
				'string',
				'between:2,32',
				new SensitiveWordRule()
			]
		]);
		return response('表单验证通过');
}
```
## Artisan

`Artisan` 是一个`Laravel`内置的命令行操作工具集,支持自定义命令

根目录下的`artisan`文件就是命令行交互的入口文件

```bash
php artisan list 
```

**内置命令**

- `help`：为指定命令提供使用帮助信息，如 `php artisan help make:request`
- `clear-compiled`：移除编译过的类文件，比如缓存、Blade视图文件等
- `down`：将应用切换到维护模式以便查找问题
- `up`：将应用从维护模式恢复为正常模式
- `env`：显示应用当前运行环境，如 `local`、`production`
- `migrate`：运行所有数据库迁移
- `optimize`：优化应用以便提供更好的性能
- `serve`：在本地 `localhost:8000` 端口启动 PHP 内置服务器
- `tinker`：进入 Tinker REPL
- `dump-server`：启动 dump server 收集 `dump` 信息
- `preset`：切换应用前端框架脚手架代码，比如从 Vue 切换到 React

**选项**

在我们继续介绍 Artisan 命令其它内容之前，我们先来看一下在运行 Artisan 命令时可以传入的选项参数：

- `-q`：禁止所有输出
- `-v`、`-vv`、`-vvv`：命令执行输出的三个级别，分别代表正常、详细、调试
- `--no-interaction`：不会问任何交互问题，所以适用于运行无人值守自动处理命令
- `--env`：允许你指定命令运行的环境
- `--version`：打印当前 Laravel 版本

上述选项可以单独运行，也可以和具体命令一起运行。

**分组命令**

`php artisan list` 罗列出的其它命令都是被分门别类的，我们不会详细介绍所有命令，大致看一下分组：

- `app`：只包含 `app:name` 命令，用于替换应用默认命名空间 `App\`
- `auth`：只包含 `auth:clear-resets`，用于从数据库清除已过期的密码 Token
- `cache`：应用缓存相关命令
- `config`：`config:cache` 用于缓存应用配置，`config:clear` 用于清除缓存配置
- `db`：`db:seed` 用于通过填充器填充数据库（如果编写了填充器的话）
- `event`：`event:generate` 用于根据注册信息生成未创建的事件类及监听器类
- `key`：`key:generate` 用于手动设置应用的 `APP_KEY`
- `make`：用于根据模板快速生成应用各种脚手架代码，如认证、模型、控制器、数据库迁移文件等等等，我们会将每个命令穿插在相应教程中介绍
- `migrate`：数据库迁移相关命令（数据库教程中会详细介绍）
- `notifications`：`notifications:table` 用于生成通知表
- `optimize`：`optimize:clear` 用于清除缓存的启动文件
- `package`：`package:discover` 用于重新构建缓存的扩展包 manifest
- `queue`：队列相关命令（队列教程中会详细介绍）
- `route`：路由相关命令，`route:cache` 和 `route:clear` 分别用于缓存路由信息和清除路由缓存，`route:list`用于列出应用所有路由信息
- `schedule`：调度任务相关命令（调度任务教程中会介绍）
- `session`：对于数据库驱动的 Session，我们通过 `session:table` 生成 `sessions` 数据表
- `storage`：`storage:link` 生成一个软链 `public/storage` 指向 `storage/app/public`
- `vendor`：`vendor:publish` 用于发布扩展包中的公共资源
- `view`：`view:cache` 用于编译应用所有 Blade 模板，`view:clear` 用于清除这些编译文件
### 编写命令

使用系统自带命令`make:command`

```bash
php artisan make:command WelcomeMessage --command=welcome:message
```

`WelcomeMessage`为`Artisan`命令类名,`--command`自定义该命令名称(不指定系统会根据类名自动生成)

创建一个`app/Console/Commands/WelcomeMessage.php`

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class WelcomeMessage extends Command
{
	// 命令名
    protected $signature = 'welcome:message';
	// 命令名
    protected $description = 'Command description';
	
    public function __construct()
    {
        parent::__construct();
    }
	// 命令具体逻辑
    public function handle()
    {
        //
    }
}

```



在`App/Console/Kernel.php`下注册命令

```php
protected $commands = [
	App\Console\WelcomeMessage::class
];
```

`routes/console.php`也可编写简单的命令

```php
Artisan::command('info', function () {
    $this->info('这是一个 artisan 自定义命令');
})->describe('自定义命令');
```
### 进阶

EXAMPLE

```php
protected $signature = 'make:migration {name : The name of the migration}
    {--create= : The table to be created}
    {--table= : The table to migrate}
    {--path= : The location where the migration file should be created}
    {--realpath : Indicate any provided migration file paths are pre-resolved absolute paths}';
```

要定义一个必填参数，需要用花括号将其包裹起来：

```
make:migration {name}
```

要定义一个可选参数，可以在参数名称后面加一个问号：

```
make:migration {name?}
```

要为可选参数定义默认值，可以这么做：

```php
make:migration {name=create_users_table}
```

选项和参数很像，但是选项有前缀 `--`，而且可以在没有值的情况下使用，要添加一个最基本的选项，可以通过花括号将其包裹：

```
make:migration {name} {--table} // 现在这种写法仅代表命令,不接受值,它产出 1 | ''
```

![UTOOLS1567683896158.png](https://user-gold-cdn.xitu.io/2019/9/5/16d013def31e9dd0?w=782&h=201&f=png&s=29035)

如果这个选项必须要设置选项值，可以加上一个 `=`：

```php
make:migration {name} {--table=}
```

![UTOOLS1567684066407.png](https://user-gold-cdn.xitu.io/2019/9/5/16d01408ae23fd1e?w=787&h=149&f=png&s=31065)

然后如果你想要为其设置默认选项值，可以这么做：

```php
make:migration {name} {--table=users}
```

![UTOOLS1567684004378.png](https://user-gold-cdn.xitu.io/2019/9/5/16d013f940df658f?w=785&h=162&f=png&s=35452)

此外，选项还支持缩写，比如我们可以通过 `T` 来代表 `table`：

```
make:migration {name} {--T|table}
```

不管是参数还是选项，如果你想要接收数组作为参数，都要使用 `*` 通配符：

```
make:migration {name*} {--table=*}
```

> 注：数组参数必须是参数列表中的最后一个参数。

常用的交互:

```php
public function handle()
    {
		// 文本输入
		$name = $this->ask('你的名字');
		// 提示
		$city = $this->anticipate('你来自哪个城市', [
			"beijin",
			"hangzhou",
			"shenzhen"
		]);
		// 隐藏输入
		$password = $this->secret('输入密码才能执行此命令');
		if($password != '123'){
			$this->error('密码错误');
			exit(-1);
		}
		// 确认
		if ($this->confirm('确定要执行此命令吗?')) {
			$this->info('ok');
		}
		// 可选和默认值
		$city = $this->choice('你来自哪个城市', [
			'北京', '杭州', '深圳'
		], 0);
		// 行信息 白
		$this->line('11');
		// 注释信息 黄
		$this->comment('22');
		// 输出问题 蓝底黑
		$this->question('33');
		// 输出表格
		$this->table(['name','city'],[['zhou','beijing'],['wang','shanghai']]);
		// 输出进度条
		$totalUnits = 100;
		$this->output->progressStart($totalUnits);

		$i=0;
		while($i++ < $totalUnits){
			sleep(10);
			$this->output->progressAdvance();
		}
		$this->output->progressFinish();
		exit(0);
    }
```

在应用代码中可通过`Artisan`调用命令

```php
Route::get('/',function(){
    $exit_code = Artisan:call('welcome:message',[
        'name'=>'1',
        '--city'=>2
    ]);
});
```

如果选项没有值以`true | false`代替
## Laravel & Eloquent
### 基本配置

```php
'mysql'=>[
    'driver'=>'mysql',
    'url'=>env('OLD_DATABASE_URL'),
    'host'=>env('OLD_DB_HOST','127.0.0.1'),
    'port'=>env('OLD_DB_PORT','3306'),
    'database'=>env('OLD_DATABASE','forge'),
    'username' => env('OLD_DB_USERNAME', 'forge'),
    'password' => env('OLD_DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'prefix_indexes' => true,
    'strict' => true,
    'engine' => null,
],
```

配置读写分离

```php
'mysql'=>[
    'driver'=>'mysql',
    'read'=>[
        'host'=>env('OLD_DB_READ','127.0.0.1'),
        // 读写分离也可单独配置账号
        // username ...
    ],
    'write'=>[
        'host'=>env('OLD_DB_WRITE','127.0.0.1'),
        // 这种配置双host或用户名的较常用于线上或多个数据库
        // 本地模拟读写分离只需配置 database => 就可
    ],
    'url'=>env('OLD_DATABASE_URL'),
    'port'=>env('OLD_DB_PORT','3306'),
    'database'=>env('OLD_DATABASE','forge'),
    'username' => env('OLD_DB_USERNAME', 'forge'),
    'password' => env('OLD_DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'prefix_indexes' => true,
    'strict' => true,
    'engine' => null,
],
```

读操作较为常用所以可配置多个读配置和主机

```php
'read' => [
    'host' => [env('DB_HOST_READ_1'), env('DB_HOST_READ_2')],
],
```

这里还有一个小插曲

SCENE 1:

新版本的`MySql`默认使用的连接验证是`caching_sha2_password`但是我安装的`php mysqli`扩展并不支持`caching_sha2`验证,解决方法如下

![UTOOLS1567749776847.png](https://user-gold-cdn.xitu.io/2019/9/6/16d052b37951c0e8?w=726&h=207&f=png&s=19330)

或者你可以启用`phpstudy`上的sql服务,关闭你的`laradock sql`服务或是修改端口,本质上是`laradock sql`版本较高无法连接.

SCENE 2:

在配置完读写分离本地配置后需要运行命令`php artisan migrate`将数据库迁移应用到写数据库.

此时会报错

```txt
SQLSTATE [42000]：语法错误或访问冲突：1071指定密钥太长; 最大密钥长度为767字节（SQL：alter table usersadd unique users_email_unique（email））
```

因为`Laravel 5.4` 对默认数据库字符集进行更改以便对储存表情符号提供支持,所以旧版`MySql`数据库会有字节长度超出的错误

`app/Providers/AppServiceProvider.php`

```php
 public function boot()
 {
     // 在 boot 中指定默认字符长度
     Schema::defaultStringLength(191);
 }
```

接下来执行`php artisan migrate`就应用迁移了

![UTOOLS1567757416400.png](https://user-gold-cdn.xitu.io/2019/9/6/16d059fc85c035c7?w=1037&h=269&f=png&s=201940)
### 迁移

将数据库操作通过编写代码来定义,这样在任何新环境都可以快速还原表结构.

代码驱动的数据表结构定义功能叫做迁移(Migrations),意为在不同环境中快速迁移数据表结构变动

`database/mingrations`目录下有迁移文件

>  当我们迁移数据库时，系统获取所有数据库迁移文件（包括 `database/migrations` 目录下和扩展包中注册的），然后按照文件名中包含的日期时间排序，从最早的迁移文件开始，依次执行每个迁移类中的 `up` 方法，最后完成数据库迁移；反之，当我们回滚数据库时，按照日期时间排序，从最晚的迁移文件开始，依次执行每个迁移类的 `down` 方法，最后完成数据库回滚，如果指定回滚其中某几步的话，回滚到对应的迁移文件即终止。

**创建迁移文件 create_user_table**

```php
php artisan make:migration create_users_table --create=users  # 创建数据表迁移
php artisan make:migration alter_users_add_nickname --table=users  # 更新数据表迁移
```

```php
public function up()
    {	
    	// 此时Schema用的是create方法
        Schema::create('users', function (Blueprint $table) {
            // 在回调函数中注入表操作
			$table->increments('id');
			$table->string('name');
			$table->string('email')->unique();
			$table->timestamp('email_verified_at')->nullable();
			$table->string('password');
			$table->rememberToken();
			$table->timestamps();
        });
    }
```

`down()`函数用于**删除表**,`Schema::dropIfExists`较`Schema::drop`方法更好的地方在于,在函数前会判断表存在否

```php
public function down()
{
    Schema::dropIfExists('users');
}
```

创建表迁移文件中可以添加表初始字段,但是**修改表需要增量创建迁移文件**.

```bash
php artisan make:migration alter_users_add_nickname --table=users # 新增nickname字段
```

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('nickname',100)->after('name')->nullable()->comment('用户昵称');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('nickname');
    });
}
```

**修改表字段**需要借助`doctrine/dbal`扩展包

```bash
composer require doctrine/dbal
```

```php
$table->string('nickname',50)->change(); // 定义完新字段属性后调用change方法执行变更
```
### 索引和外键

前面我们已经演示了如何创建、删除、修改表字段，接下来我们要讨论如何对表字段设置索引和外键。

**添加索引**

对字段设置索引我们已经在 `create_users_table` 中看到过了：

```
$table->string('email')->unique();
```

通过这种调用方式，我们将 `email` 字段设置为了唯一索引。我们还可以为某个字段设置普通索引：

```
$table->string('name')->index();
```

主键索引通过 `increments` 方法创建，该方法会创建一个自动增长的主键索引：

```
$table->increments('id');
```

除了上述这些调用方式外，我们还可以通过另一种方式来为字段创建索引：

```
$table->primary('id');
$table->index('name');
$table->unique('email');
```

这样做的一个好处是一次支持传入多个字段，从而构建混合索引：

```
$table->index(['name', 'email']);
```

**移除索引**

移除索引也很简单：

```
$table->dropIndex('name');
$table->dropUnique('email');
$table->dropPrimary('id');
```

**添加、移除外键**

所谓外键指的是一张表的字段 A 引用另一张表的字段 B，那么字段 A 就是外键，通过外键可以建立起两张表之间的关联关系，这样，数据表之间就是有关联的了，而不是一个个孤立的数据集。

在迁移类中，如果我们想建立文章表中的 `user_id` 字段与用户表中的 `id` 之间的关联关系，可以通过这种方式来定义外键索引来实现：

```
$table->foreign('user_id')->references('id')->on('users');
```

如果你还想进一步指定外键约束（级联删除和更新，比如我们删除了 `users` 表中的某个 `id` 对应记录，那么其在文章表中对应 `user_id` 的所有文章会被删除，好危险！），可以通过 `onDelete` 和 `onUpdate` 方法来实现：

```
$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
$table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
```

如果你想要删除外键索引，可以通过 `dropForeign` 方法来实现：

```
$table->dropForeign(['user_id']);
```

或者通过完整的外键索引名称来删除：

```
$table->dropForeign('posts_user_id_foreign');
```

> 注：不推荐使用外键，更不要使用外键约束功能，因为影响数据库性能，而且级联删除有可能造成非常严重的无法挽回的后果。关联关系我们建议通过业务逻辑代码来实现，比如后面介绍的 Eloquent ORM 专门提供了常见的关联关系方法

**执行迁移**

执行变更很简单，通过：

```
php artisan migrate 
```

就可以按照迁移文件生成时间的先后顺序依次执行所有的数据库迁移。

回滚要稍微复杂点，Laravel 支持多种形式的回滚，如果只回滚最后一个迁移文件的变更，可以通过：

```
php artisan migrate:rollback
```

来实现，如果要回滚多个迁移文件的变更，可以通过 `--step=` 指定步数（按照迁移文件生成时间逆序执行）：

```
php artisan migrate:rollback --step=5
```

如果是要回滚所有迁移文件的变更，将数据库恢复到初始状态，需要运行以下命令：

```
php artisan migrate:reset
```
### 填充器

`seed`填充类位于`database/seeds`目录

Laravel 提供了两种方式来运行填充器：一种是独立的填充命令，另一种是在运行迁移命令时通过指定标识选项在创建数据表时填充。

独立的填充命令如下：

```
php artisan db:seed
php artisan db:seed --class=UsersTableSeeder
```

上述第一个 Artisan 命令会以 `DatabaseSeeder` 为入口类，调用该类的 `run` 方法，你可以将所有对其他填充器的调用定义在该方法中，例如：

```
$this->call(UsersTableSeeder::class);
```

这样，就可以一次性调用所有填充器啦。

当然，你也可以通过 `--class=` 选项指定运行某个填充器类的 `run` 方法。

此外，在某些时候，你可能希望在运行迁移命令的同时填充测试数据，尤其是在初始化一些演示项目的时候。这可以通过不指定值的 `--seed` 选项来实现：

```
php artisan migrate --seed 
php artisan migrate:refresh --seed
```

第一条命令用于执行迁移命令时运行填充器类 `DatabaseSeeder` 填充数据，第二条命令用于回滚所有迁移并重新运行迁移同时填充初始化数据

**新建填充器类**

```bash
php artisan make:seeder UserTableSeeder
```

**编写run方法**

```php
<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserTableSeeder extends Seeder
{
    public function run()
    {
		DB::table('users')->insert([
			'name'=>str_random(10),
			'email'=>str_random(10) . '@example.com',
			'password'=>bcrypt('secret'),
		]);
    }
}
```

```bash
php artisan db:seed --class=UsersTableSeeder
```

可在基类`DatabaseSeeder.php`中添加

```php
<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(UsersTableSeeder::class);
    }
}
```

```bash
php artisan db:seed
```
#### 通过模型工厂填充

`database/factories`

```php
<?php
// database/factorise/UserFactory.php
// 默认的User模型工厂
use App\User;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'remember_token' => Str::random(10),
    ];
});

```

`Faker`类库提供了伪造字段[方法](https://github.com/fzaninotto/Faker),
`Faker`支持中文 `config/app.php`

```php
'faker_locale' => 'zh_CN',
```

```php
public function run()
{
    // DB::table('users')->insert([
    // 	'name'=>str_random(10),
    // 	'email'=>str_random(10) . '@example.com',
    // 	'password'=>bcrypt('secret'),
    // ]);

    factory(\App\User::class,5)->create();
}
```

通过全局的辅助函数`factory`调用,

由于我们在 `UserFactory.php` 中全局定义了 `User` 模型的模型工厂，所以在这里只需调用 `factory` 方法，传入对应模型类和要填充的记录数即可，最后再调用 `create` 方法让变更生效。
### CRUD

通过 `DB` 门面提供的 `statement` 方法执行原生的 SQL Statement 语句，比如创建、删除、修改数据表操作：

``` php
DB::statement('drop table `users`');
DB::statement('create table `users` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL)');
```

**查询**

```php
$users = DB::select('select * from `users`');
$name = 'zhou'
$users = DB::select('select * from `users` where `name` = ?', [$name]);
$users = DB::select('select * from `users` where `name` = :name', ['name' => $name]);
```

**原生插入语句**

想要在数据库中插入一条记录，通过 `DB` 门面提供的 `insert` 语句即可：

```
$name = str_random(10);
$email = str_random(10) . '@163.com';
$password = bcrypt('secret');
$flag = DB::insert('insert into `users` (`name`, `email`, `password`) values (?, ?, ?)', [$name, $email, $password]);
```

如果插入成功，返回 `true`，插入失败，则抛出 `QueryException` 异常。

**原生更新语句**

要修改数据表记录，可以通过 `DB` 门面提供的 `update` 方法：

```
$name = str_random(8);
$id = 8;
$affectedRows = DB::update('update `users` set `name` = ? where id = ?', [$name, $id]);
```

如果更新成功，返回受影响行数，如果更新数据与原记录数据一样，则返回`0`，如果更新出错，则抛出 `QueryException` 异常。

**原生删除语句**

要删除数据表记录，可以通过 `DB` 门面的 `delete` 方法实现：

```
$id = 8;
$affectedRows = DB::delete('delete from `users` where id = ?', [$id]);
```

和更新语句一样，如果删除成功，该方法返回受影响行数，删除记录不存在，返回 `0`，删除出错，抛出 `QueryException` 异常。

> 友情提示：更新语句和删除语句一定要谨慎注意 `where` 条件，否则很容器由于疏忽更新了所有数据或删除了所有数据，后果不堪设想！
#### 构建器CRUD

查询构建器是基于`DB`门面的，只不过需要调用其提供的 `table` 方法构建一个基于指定数据表的查询构建器

`$user = DB::table('users')->get()`

``` bash
λ php artisan tinker
Psy Shell v0.9.9 (PHP 7.2.1 — cli) by Justin Hileman
>>> $user = DB::table('users')->get()
=> Illuminate\Support\Collection {#2970
     all: [
       {#2972
         +"id": 1,
         +"name": "Mr. Ryder Bogan PhD",
         +"nickname": null,
         +"email": "cartwright.felton@example.org",
         +"email_verified_at": "2019-09-06 11:30:19",
         +"password": "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
         +"remember_token": "7V5VzUq7BA",
         +"created_at": "2019-09-06 11:30:19",
         +"updated_at": "2019-09-06 11:30:19",
       },
       {#2974
         +"id": 2,
```

```php
$user = 'Lamont Predovic'
$users = DB::table('users')->where('name',$name)->get() // []
```

使用查询构建器进行查询，无需手动设置参数绑定来规避 SQL 注入攻击，因为 Laravel 底层会帮助我们自动实现参数绑定，所以推荐使用查询构建器进行数据库操作。

```php
$user = DB::table('users')->where('name', $name)->first(); // {}
```

```php
$user = DB::table('users')->select('id', 'name', 'email')->where('name', $name)->first();
// 返回指定字段
```

**插入记录**

要通过查询构建器插入一条记录，也很简单，通过 `insert` 方法即可：

```php
$flag = DB::table('users')->insert([
    'name' => str_random(10),
    'email' => str_random(8) . '@163.com',
    'password' => bcrypt('secret')
]);
```

如果想要在插入之后获取对应记录的主键 ID，将 `insert` 方法改为调用 `insertGetId` 方法：

```php
$userId = DB::table('users')->insertGetId([
    'name' => str_random(10),
    'email' => str_random(8) . '@qq.com',
    'password' => bcrypt('secret')
]);
```

查询构建器还支持一次插入多条记录：

```php
DB::table('users')->insert([
    ['name' => str_random(10), 'email' => str_random(8) . '@qq.com', 'password' => bcrypt('123')],
    ['name' => str_random(10), 'email' => str_random(8) . '@qq.com', 'password' => bcrypt('456')],
    ['name' => str_random(10), 'email' => str_random(8) . '@qq.com', 'password' => bcrypt('789')],
]);
```

**更新记录**

```php
$id = 11;
$affectedRows = DB::table('users')->where('id', '>', $id)->update(['name' => str_random(8)]);
```

同样，该方法返回的也是受影响行数，具体逻辑和原生更新语句一样，不再赘述，我们可以通过 `where` 方法来指定过滤条件。

> 注：`where` 方法第二个参数省略的话，默认是 `=`，如果不是相等条件，需要手动指定该参数值，比如 `>` 表示大于，`<` 表示小于，和比较运算符一致。

如果是数值字段的更新的话，Laravel 还为我们提供了 `increment` 和 `decrement` 方法用于快速进行数值增减，默认步长是 `1`，当然你可以通过第二个参数指定步长值：

```php
DB::table('posts')->where('id', 100)->increment('views'); // views+1
DB::table('posts')->where('id', 100)->increment('views', 5); // views+5
DB::table('posts')->where('id', 100)->decrement('votes');  // votes-1
```

**删除记录**

通过查询构建器删除记录可以通过 `delete` 方法来实现：

```php
$id = 11;
$affectedRows = DB::table('users')->where('id', '>=', $id)->delete();
```

同样，我们通过 `where` 方法指定删除 `id >= 11` 的记录，`delete` 方法返回受影响行数，具体逻辑和原生删除语句也是一样的。

如果我们想要清空整张数据表，可以通过不指定 where 条件来实现：

```php
$affectedRows = DB::table('users')->delete();
```

如果我们还想在清空记录之后重置自增 ID，可以通过 `truncate` 方法来实现：

```php
$affectedRows = DB::table('users')->truncate();
```
###  复杂查询语句

获取返回数据的指定字段

```php
$name = 'zhou';
$users = DB::table('users')->where('name',$name)->value('email');
```

通过`exists`方法判断某个字段值在数据库中是否存在对应记录
如果存在，返回 true，否则返回 false。该方法还有一个与之相对的方法 doesntExist()。

```php
$users = DB::table('users')->where('name',$name)->exists();
```

查询并返回以指定字段值为值,以指定字段值为键构建的数组

```php
$users = DB::table('users')->where('id','<',10)->pluck('name','id');
// [ 1=>'user name' ,2=>'username']
```

单次查询结果集较大,需要分块处理,避免内存泄漏

```php
$names = [];
DB::table('users')->orderBy('id')->chunk(5, function ($users) use (&$names) {
    foreach ($users as $user) {
        $names[] = $user->name;
    }
});
```

**聚合函数**

在开发后台管理系统时，经常需要对数据进行统计、求和、计算平均值、最小值、最大值等，对应的方法名分别是 count、sum、avg、min、max：

```php
$num = DB::table('users')->count();       # 计数     9
$sum = DB::table('users')->sum('id');     # 求和    45
$avg = DB::table('users')->avg('id');     # 平均值   5
$min = DB::table('users')->min('id');     # 最小值   1
$max = DB::table('users')->max('id');     # 最大值   9
```
#### 高级where 查询

**base**

第一个参数表示字段名，第二个参数表示运算符（支持SQL所有运算符），第三个参数表示比较值。

```php
DB::table('posts')->where('views', 0)->get();      # 此处等号可以省略
DB::table('posts')->where('views', '>', 0)->get();  
DB::table('posts')->where('views', '<>', 0)->get();
```

**like**

模糊查询

```php
DB::table('posts')->where('title', 'like', 'Laravel%')->get();
```

**and**

以多条`where`的形式表示`and`查询

```php
DB::table('posts')->where('id', '<', 10)->where('views', '>', 0)->get();

DB::table('posts')->where([
    ['id', '<', 10],
    ['views', '>', 0]
])->get();

```

**or**

```php
DB::table('posts')->where('id', '<', 10)->orWhere('views', '>', 0)->get();
```

**between**区间查询

在一些涉及数字和时间的查询中，BETWEEN 语句可以排上用场，用于获取在指定区间的记录。在查询构建器中，我们可以通过 `whereBetween` 方法来实现 between 查询：

```
DB::table('posts')->whereBetween('views', [10, 100])->get();
```

上述代码表示获取 `where view between 10 and 100` 的数据库记录。与之相对的还有一个 `whereNotBetween` 方法，用于获取不在指定区间的数据库记录：

```
DB::table('posts')->whereNotBetween('views', [10, 100])->get();
```

对应的 WHERE 条件是 `where views not between 10 and 100`。

你可以看出来 between 语句是可以通过 and/or 查询来替代的，只不过使用 between 语句会更简单明了。

**in查询**

IN 查询也很常见，比如我们需要查询的字段值是某个序列集合的子集的时候。IN 查询可以通过 whereIn 方法来实现：

```
DB::table('posts')->whereIn('user_id', [1, 3, 5, 7, 9])->get();
```

对应的 WHERE 子句是 `where user_id in (1, 3, 5, 7, 9)`。使用该方法时，需要注意传递给 `whereIn` 的第二个参数不能是空数组，否则会报错。

同样，与之相对的，还有一个 `whereNotIn` 方法，表示与 `whereIn` 相反的查询条件。将上述代码中的 `whereIn` 方法改为 `whereNotIn`，对应的查询子句就是 `where user_id not in (1, 3, 5, 7, 9)`。

**null查询**

NULL 查询就是判断某个字段是否为空的查询，Laravel 查询构建器为我们提供了 `whereNull` 方法用于实现该查询：

```
DB::table('users')->whereNull('email_verified_at')->get();
```

对应的 WHERE 查询子句是 `where email_verified_at is null`，同样，该方法也有与之相对的 `whereNotNull` 方法，例如，要进行 `where email_verified_at is not null` 查询，可以这么实现：

```
DB::table('users')->whereNotNull('email_verified_at')->get();
```

**日期查询**

关于日常查询，查询构建器为我们提供了丰富的方法，从年月日到具体的时间都有覆盖：

```
DB::table('posts')->whereYear('created_at', '2018')->get();   # 年
DB::table('posts')->whereMonth('created_at', '11')->get();    # 月
DB::table('posts')->whereDay('created_at', '28')->get();      # 一个月的第几天
DB::table('posts')->whereDate('created_at', '2018-11-28')->get();  # 具体日期
DB::table('posts')->whereTime('created_at', '14:00')->get();  # 时间
```

上面这几个方法同时还支持 `orWhereYear`、`orWhereMonth`、`orWhereDay`、`orWhereDate`、`orWhereTime`。

**字段相等查询**

有的时候，我们并不是在字段和具体值之间进行比较，而是在字段本身之间进行比较，查询构建器提供了 `whereColumn` 方法来实现这一查询：

```
DB::table('posts')->whereColumn('updated_at', '>', 'created_at')->get();
```

对应的 WHERE 查询子句是 `where updated_at > created_at`。

**JSON查询**

从 MySQL 5.7 开始，数据库字段原生支持 JSON 类型，对于 JSON 字段的查询，和普通 where 查询并无区别，只是支持对指定 JSON 属性的查询：

```
DB::table('users')
    ->where('options->language', 'en')
    ->get();
```

如果属性字段是个数组，还支持通过 `whereJsonContains` 方法对数组进行包含查询：

```
DB::table('users')
    ->whereJsonContains('options->languages', 'en_US')
    ->get();

DB::table('users')
    ->whereJsonContains('options->languages', ['en_US', 'zh_CN'])
    ->get();
```

**参数分组**

除了以上这些常规的 WHERE 查询之外，查询构建器还支持更加复杂的查询语句，考虑下面这个 SQL 语句：

```
select * from posts where id <= 10 or (views > 0 and created_at < '2018-11-28 14:00');
```

貌似我们通过前面学到的方法解决不了这个查询语句的构造，所以我们需要引入更复杂的构建方式，那就是引入匿名函数的方式（和连接查询中构建复杂的连接条件类似）：

```
DB::table('posts')->where('id', '<=', 10)->orWhere(function ($query) {
    $query->where('views', '>', 0)
        ->whereDate('created_at', '<', '2018-11-28')
        ->whereTime('created_at', '<', '14:00');
})->get();
```

在这个匿名函数中传入的 `$query` 变量也是一个查询构建器的实例。这一查询构建方式叫做「参数分组」，在带括号的复杂 WHERE 查询子句中都可以参考这种方式来构建查询语句。

**WHERE EXISTS**

此外，我们还可以通过查询构建器提供的 `whereExists` 方法构建 WHERE EXISTS 查询：

```
DB::table('users')
    ->whereExists(function ($query) {
        $query->select(DB::raw(1))
            ->from('posts')
            ->whereRaw('posts.user_id = users.id');
    })
->get();
```

对应的 SQL 语句是：

```
select * from `users` where exists (select 1 from `posts` where posts.user_id = users.id);
// 在posts 中找到一个与 users 一致的
```

用于查询发布过文章的用户。

**子查询**

有时候，我们会通过子查询关联不同的表进行查询，考虑下面这个 SQL 语句：

```
select * from posts where user_id in (select id from users where email_verified_at is not null);
```

对于这条 SQL 语句，我们可以通过查询构建器提供的子查询来实现：

```
$users = DB::table('users')->whereNotNull('email_verified_at')->select('id');
$posts = DB::table('posts')->whereInSub('user_id', $users)->get();
```

除了 IN 查询外，普通的 WHERE 查询也可以使用子查询，对应的方法是 `whereSub`，但是子查询的效率不如连接查询高，所以我们下面来探讨连接查询在查询构建器中的使用。

#### 连接查询



- 内连接：使用比较运算符进行表间的比较，查询与连接条件匹配的数据，可细分为等值连接和不等连接
  - 等值连接（=）：如 `select * from posts p inner join users u on p.user_id = u.id`
  - 不等连接（<、>、<>等）：如 `select * from posts p inner join users u on p.user_id <> u.id`
- 外链接：
  - 左连接：返回左表中的所有行，如果左表中的行在右表中没有匹配行，则返回结果中右表中的对应列返回空值，如 `select * from posts p left join users u on p.user_id = u.id`
  - 右连接：与左连接相反，返回右表中的所有行，如果右表中的行在左表中没有匹配行，则结果中左表中的对应列返回空值，如 `select * from posts p right join users u on p.user_id = u.id`
  - 全连接：返回左表和右表中的所有行。当某行在另一表中没有匹配行，则另一表中的列返回空值，如 `select * from posts p full join users u on p.user_id = u.id`
- 交叉连接：也称笛卡尔积，不带 `where` 条件子句，它将会返回被连接的两个表的笛卡尔积，返回结果的行数等于两个表行数的乘积，如果带 `where`，返回的是匹配的行数。如 `select * from posts p cross join users u on p.user_id = u.id`

![UTOOLS1567775329384.png](http://yanxuan.nosdn.127.net/fcb64039ea8e5f2b4b620e3904556182.png)

创建迁移文件并定义迁移

```bash
php artisan make:migration create_posts_table --create=posts
```

```PHP
public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->increments('id');
			$table->string('title')->comment('标题');
			$table->text('content')->comment('内容');
			$table->integer('user_id')->unsigned()->default(0);
			$table->integer('views')->unsigned()->default(0)->comment('浏览数');
			$table->index('user_id');
			$table->timestamps();
        });
    }
```

创建模型类,位于`app/Post.php`,模型类创建好后就是空的

```bash
php artisan make:model Post
```

创建模型工厂,并定义数据填充规则

```php
php artisan make:factory PostFactory --model=Post
```

```php
$factory->define(Post::class, function (Faker $faker) {
    return [
		'title'=>$faker->title,
		'content'=>$faker->text,
		'user_id'=>mt_rand(1,15),
		'views'=>$faker->randomDigit
    ];
});
```

创建填充类,定义`run`方法

```php
php artisan make:seeder PostsTableSeeder
```

```php
public function run()
{
    factory(\App\Post::class,30)->create();
}
```

执行迁移并填充数据

```php
php artisan migrate --seed --class=PostsTableSeeder
```

**内连接**

在查询构建器中实现

```php
$posts = DB::table('posts')
    ->join('users', 'users.id', '=', 'posts.user_id')
    ->select('posts.*', 'users.name', 'users.email')
    ->get();
```

原生`SQL`查询

```sql
select posts.*, users.name, users.email from posts inner join users on users.id = posts.user_id;
```

> ! 当两张表有字段名相同的字段，并且这两个字段都包含在 select 方法指定的字段中，需要为其中> 一个字段取别名，否则会产生冲突`select('posts.*', 'users.name as username', 'users.email')`

**左连接**

左连接也可称作左外连接，在查询构建器中，可以通过 `leftJoin` 方法实现：

```
$posts = DB::table('posts')
    ->leftJoin('users', 'users.id', '=', 'posts.user_id')
    ->select('posts.*', 'users.name', 'users.email')
    ->get();
```

对应的 SQL 语句是：

```SQL
SELECT
	posts.*,
	users.NAME,
	users.email 
FROM
	posts
	LEFT JOIN users ON users.id = posts.user_id;
```

左连接时`posts`即为左表

**右连接**

右连接也可称作右外链接，在查询构建器中，可以通过 `rightJoin` 方法实现：

```
$posts = DB::table('posts')
    ->rightJoin('users', 'users.id', '=', 'posts.user_id')
    ->select('posts.*', 'users.name', 'users.email')
    ->get();
```

对应的 SQL 语句如下：

```SQL
SELECT
	posts.*,
	users.NAME,
	users.email 
FROM
	posts
	RIGHT JOIN users ON users.id = posts.user_id;
```

右连接`users`即为右表

**复杂查询**

```SQL
SELECT
	posts.*,
	users.NAME,
	users.email 
FROM
	posts
	INNER JOIN users ON users.id = posts.user_id 
	AND users.email_verified_at IS NOT NULL 
WHERE
	posts.views > 0;
```

通过匿名函数组装实现复杂查询

```php
$posts = DB::table('posts')
    ->join('users', function ($join) {
        $join->on('users.id', '=', 'posts.user_id')
            ->whereNotNull('users.email_verified_at');
    })
    ->select('posts.*', 'users.name', 'users.email')
    ->where('posts.views', '>', 0)
    ->get();
```

**联合查询**

`union`合并多个查询结果

```SQL
( SELECT * FROM `posts` WHERE `id` <= 10 ) UNION
( SELECT * FROM `posts` WHERE `views` = 0 )
```

```php
$posts_a = DB::table('posts')->where('views', 0);
$posts_b = DB::table('posts')->where('id', '<=', 10)->union($posts_a)->get();
```

查询构建器也支持 UNION ALL 查询，对应的方法是 unionAll，该方法与 union 的区别是允许重复记录

**排序**

倒序

```SQL
SELECT
	* 
FROM
	`posts` 
ORDER BY
	`created_at` DESC;
```

```php
$users = DB::table('posts')
    ->orderBy('created_at', 'desc')
    ->get();
```

随机排序

```php
DB::table('posts')->inRandomOrder()->get();
```

> ! 小结果集可以使用随机,但是大结果集会影响性能

**分组**

```SQL
SELECT
	user_id,
	SUM( views ) AS total_views 
FROM
	posts 
GROUP BY
	user_id
```

```php
$posts = DB::table('posts')
    ->groupBy('user_id')
    ->selectRaw('user_id, sum(views) as total_views')
    ->get();
```

使用`having`对分组结果进行过滤

```sql
SELECT
	user_id,
	SUM( views ) AS total_views 
FROM
	posts 
GROUP BY
	user_id 
HAVING
	total_views >= 10
```

```php
$posts = DB::table('posts')
    ->groupBy('user_id')
    ->selectRaw('user_id, sum(views) as total_views')
    ->having('total_views', '>=', 10)
    ->get();
```

 **分页查询**

 ```sql
SELECT
	* 
FROM
	posts 
WHERE
	views > 0 
ORDER BY
	created_at DESC 
	LIMIT 5 OFFSET 10
 ```

 ```PHP
 $posts = DB::table('posts')->orderBy('created_at', 'desc')
    ->where('views', '>', 0)
    ->skip(10)->take(5)
    ->get();
 ```

skip 方法传入的参数表示从第几条记录开始，take 传入的参数表示一次获取多少条记录
offset 表示从第几条记录开始，limit 表示一次获取多少条记录

```php
$posts = DB::table('posts')->orderBy('created_at', 'desc')
    ->where('views', '>', 0)
    ->offset(10)->limit(5)
    ->get();
```
### 模型 CRUD

定义模型类

```bash
php artisan make:model Post
```

> 注：如果对应的数据表尚未创建，你还可以在创建模型类的同时创建对应的数据库迁移文件，通过` php artisan make:model Post -m` 即可。如果你想将模型类创建到 `app/Models` 目录下，可以这么运行上述命令 `php artisan make:model Models/Post`

`Post`模型类创建后并没有内容,但依据(约定优于配置)依然可以通过它完成数据表记录的增删改查

**表名**

Eloquent 约定模型类映射表名是将类名由驼峰格式转化为小写+下划线（含多个单词的话），最后将其转化为复数形式,`PostTag -> post_tag` ,也可以通过手动设置模型类属性的方式进行自定义

```php
protected $table = 'articles';
```

**主键**

Eloquent 默认假设每张数据表都有一个整型的自增主键，其字段名为 `id`，如果你的数据表主键名不是 `id`，可以通过 `$primaryKey` 属性来指定：

```php
protected $primaryKey = 'post_id';
```

如果主键不是自增的，还可以设置 `$incrementing` 属性为 `false`：

```php
public $incrementing = false;
```

如果主键不是整型，还可以设置 `$keyType` 属性为 `string`：

```php
protected $keyType = 'string';
```

**时间戳**

Eloquent 默认约定每张表都有 `created_at` 和 `updated_at` 字段（迁移类中 `$table->timestamps()` 会生成这两个字段），并且在保存模型类时会自动维护这两个字段。如果你的数据表里面不包含这两个字段，或者只包含一个，都需要设置 `$timestamps` 属性为 `false`：

```php
public $timestamps = false;
```

或者通过 `CREATED_AT` 和 `UPDATED_AT` 常量来设置自定义的创建和更新时间字段：

```php
public const CREATED_AT = 'create_time';
public const UPDATED_AT = 'update_time';
```

此外，默认时间的存储格式是 `Y-m-d H:i:s`，你还可以通过 `$dateFormat` 属性来自定义时间戳的格式，该属性值通过 PHP 的 `date()` 函数进行解析，所以原则上支持 [date](http://php.net/manual/en/function.date.php) 函数支持的所有语法格式，比如将时间设置为 Unix 时间戳：

```php
protected $dateFormat = 'U';
```

这样，保存到数据库的时间格式就是 Unix 时间戳了，前提是你的 `created_at` 和 `updated_at` 字段是整型，否则会报格式错误。

**数据库连接**

Eloquent 模型类默认约定的数据库连接是 `config/database.php` 中配置的默认连接，如果应用配置了多个数据库连接，可以通过 `$connection` 属性为模型类指定使用哪个连接：

```php
protected $connection = 'connection_name';
```
#### 查询数据

```php
$posts = Post:all(); // 获取表所有记录
// 结果集比较大使用 chunk
Post::chunk(5,function($posts){
    foreach($posts as $post){
        if($post->views >= 0){
            continue;
        }else{
            array_push($re_arr,$post);
        }
    }
});
```

每次只获取一条查询结果,减少内存消耗

```php
foreach (Post::cursor() as $post) {
    dump($post->title . ':' . $post->content);
}
```

获取指定查询结果

```php
$posts = Post::where('views', '>', 0)->select('id', 'title', 'content')->get();
```

查询排序分页

```php
$posts = Post::where('views', '>', 0)->orderBy('id', 'desc')->offset(10)->limit(5)->get();
```

单条记录

```php
$user = User::where('name', '学院君')->first();
```

主键`id`查询

```php
$user = User::find(1);
```

通过 `firstOrFail` 或者 `findOrFail` 方法在找不到对应记录时抛出 404 异常，从而简化代码编写：

```php
$user = User::findOrFail(111);
```

**获取聚合结果**

Eloquent 模型类同样支持 `count`、`sum`、`avg`、`max`、`min` 等聚合函数查询：

```PHP
$num = User::whereNotNull('email_verified_at')->count();       # 计数     
$sum = User::whereNotNull('email_verified_at')->sum('id');     # 求和    
$avg = User::whereNotNull('email_verified_at')->avg('id');     # 平均值   
$min = User::whereNotNull('email_verified_at')->min('id');     # 最小值   
$max = User::whereNotNull('email_verified_at')->max('id');     # 最大值 
```
#### 插入数据

```PHP
$post = new App\Post;
$post->title = '测试文章标题';
$post->content = '测试文章内容';
$post->user_id = 1;
$post->save();
```

快速插入`firstOrCreate` 和 `firstOrNew`，这两个方法都会先尝试通过指定查询条件在数据库中查找对应记录，如果没有找到的话，会创建对应模型类的实例，并将查询条件作为对应字段值设置到模型属性上。两者的区别是 `firstOrCreate` 方法在设置完模型属性后会将该模型记录保存到数据库中，而 `firstOrNew` 不会：

```PHP
$post_1 = Post::firstOrCreate([
    'title' => '测试文章标题1',
    'user_id' => 1,
]);

$post_2 = Post::firstOrNew([
    'title' => '测试文章标题1',
    'user_id' => 1,
]);
```
#### 更新数据

```php
$post = Post::find(31);
$post->title = '测试文章标题更新';
$post->save();
```

快捷的更新方法 `updateOrCreate`，该方法首先会根据传入参数对模型对应记录进行更新，如果发现对应记录不存在，则会将更新数据作为初始数据插入数据库，并保存（同样也不建议这么做，除非你的场景特别适合）：

```php
$user = user::updateOrCreate(
    ['name' => '学院君'],
    ['email' => 'admin@laravelacademy.org']
);
```

有的时候我们可能需要批量更新模型对应数据表的多条记录，这可以借助查询构建器来实现：

```php
Post::where('views', '>', 0)->update(['views' => 100]);
```
#### 删除数据

```php
$post = Post::find(31);
$post->delete();
```

`destroy `方法一次删除多条记录

```php
Post::destroy([1,2,3]);
```

删除指定记录

```php
$user = User::where('name', '学院君')->fisrt();
$user->delete();
```
### 批量赋值 & 软删除

批量赋值用于将用户提交的数据写入数据库

`Eloquent`中设有白名单和黑名单过滤用户提交的数据借以提高安全性

白名单属性就是该属性中指定的字段才能应用批量赋值，不在白名单中的属性会被忽略；
黑名单属性指定的字段不会应用批量赋值，不在黑名单中的属性则会应用批量赋值。

实际开发中建议使用白名单,安全性更好.对于相对稳定或者字段很多的数据表，建议使用黑名单，免去设置字段之苦，但是对于这样的模型类，每次修改数据表结构的时候都要记得维护这个黑名单，看看是否需要变动。

黑白名单在模型中设置

```php
/**
 * 使用批量赋值的属性（白名单）
 *
 * @var array
 */
protected $fillable = [];

/**
 * 不使用批量赋值的字段（黑名单）
 *
 * @var array
 */
protected $guarded = ['*'];
```

**更新模型**

更新使用`fill`方法实现批量赋值

```php
$post = Post::findOrFail(11);
$post->fill($request->all());
$post->save();
```
#### 软删除

软删除就是将信息打上删除标记,而不是真正的在数据库抹除数据

`Eloquent`模型类软删除原理是在支持软删除的数据表中添加`deleted_at`字段

迁移文件

```bash
php artisan make:migration alter_posts_add_deleted_at --table=posts
```

```php
public function up()
{
    Schema::table('posts', function (Blueprint $table) {
        //
        $table->softDeletes();
    });
}
public function down()
{
    Schema::table('posts', function (Blueprint $table) {
        //
        $table->dropColumn('deleted_at');
    });
}
```

在模型类中添加支持软删除的`Trait`

```php
use Illuminate\Database\Eloquent\SoftDeletes;
class Posts extends Model
{
    use SoftDeletes;
}
```

> 注：你也可以修改这个默认约定的 deleted_at 字段，但何必费这个劲呢，除非你是从其它系统迁移过来的，原来的表结构已经存在了，
> 这时候可以通过再模型类中设置静态属性 DELETED_AT 来自定义软删除字段。

1. trashed  判断软删除

```php
if($post->trashed()){ dump('记录已删除'); }
```

2. withTrashed 查询软删除记录

```php
$post = Post::withTrashed()->find(32);
```

3. onlyTrashed 获取被删除记录

```php
$post = Post::onlyTrashed()->where('views', 0)->get();
```

4. restore 恢复软删除

```php
$post->restore();   // 恢复单条记录
Post::onlyTrashed()->where('views', 0)->restore(); // 恢复多条记录
```

5. forceDelete 物理删除

```php
$post->forceDelete();
```

6. delete 软删除

```php
$post = Post::findOrFail(32); // 直接查询被软删除的记录使用这个 Api 会报错 404 
$posts->delete();
```
### 访问器 & 修改器

要定义访问器很简单，在相应模型类中设置对应方法即可。以上面的 $user->display_name 为例，我们可以在 User 模型类中添加相应的方法 getDisplayNameAttribute（注意这里的转化方式，将小写字母+短划线格式属性转化为驼峰格式方法，后面的修改器也是这样）：

```php
public function getDisplayNameAttribute()
{
    return $this->nickname ? $this->nickname : $this->name;
}
```
这样，我们就可以在代码中直接通过 $user->display_name 访问期望的用户名了，以后如果你想要修改用户名显示逻辑，直接改这个方法里的代码就好了，非常方便。

注：访问器方法名中包含的字段尽量不要和数据库字段名同名，否则会覆盖数据库字段，导致通过模型属性将永远无法访问该数据库字段；另外，如果访问器内部访问了某个数据库字段，则不能将访问器和该数据库字段同名，否则会导致循环引用而报错。比如此例中，就不能将访问器方法名设置为 getNameAttribute 或 getNickNameAttribute。

**修改器**

```php
public function setCardNoAttribute($value)
{
    $value = str_replace(' ', '', $value);  // 将所有空格去掉
    $this->attributes['card_no'] = encrypt($value);
}
```

修改器传入形参`$value`不能漏掉,而后的所有该字段的操作都会通过修改器

根据`Laravel`约定大于规则的原则,我们可以访问不存在的属性

```php
// 模型
public function getNumAttribute(){

    return 123
}

$post = Posts::find(1);
$post->num; // 123

```
#### 数组 json 互转

模型内设置对应字段,注意需要`sql`字段的储存格式为`text`或`JSON`
在模型类中将字段对应属性类型转化设置为数组，这样在保存字段到数据库时，会自动将数组数据转化为 JSON 格式，在从数据库读取该字段时，会自动将 JSON 数据转化为数组格式，方便操作。

```php
protected $casts = [
    'content' => 'array'
];
```
### 查询作用域

全局作用域」，指的是预置过滤器在注册该「全局作用域」的模型类的所有查询中生效，不需要指定任何额外条件。

要实现「全局作用域」，首先需要编写一个实现 Illuminate\Database\Eloquent\Scope 接口的全局作用域类，这里我们将其命名为 `EmailVerifiedAtScope`，并将其放到 app/Scopes 目录下：

```php
<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class EmailVerifiedAtScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        return $builder->whereNotNull('email_verified_at');
    }
}

```

实现全局作用域的`apply`方法,该方法返回查询构建器上应用过滤器方法的结果.将全局作用域类注册到`User`模型类上,这样，在 User 模型类上进行查询的时候才可以应用相应的过滤条件。这个工作可以通过在 **User 模型类**中重写父类的 boot 方法来完成：

```php
protected static function boot(){
    parent::boot();
    static::addGlobalScope(new EmailVerifiedAtScope());
}
```

接下来需要在`Telescope`中查看`Queries`对应的`SQL`

`select * from `users` where `email_verified_at` is not null`

其中就包含了全局查询过滤条件

#### 匿名函数实现

全局作用域实现比较麻烦,也可通过在`boot`方法使用匿名函数实现

```php
protected static function boot()
{
    parent::boot();
    static::addGlobalScope('email_verified_at_scope', function (Builder $builder) {
        return $builder->whereNotNull('email_verified_at');
    });
}
```

#### 特定情况下移除全局作用域查询规则

```php
User::withoutGlobalScope(EmailVerifiedAtScope::class)->get(); # 指定类
User::withoutGlobalScope('email_verified_at_scope')->get();   # 匿名函数
User::withoutGlobalScopes()->get();  # 移除所有全局作用域
User::withoutGlobalScopes([FirstScope::class, SecondScope::class])->get();   # 移除多个类/匿名函数
```

#### 局部作用域

「局部作用域」的实现也比较简单，在需要应用它的模型类中定义一个过滤器方法即可。该方法需要以 scope 开头，然后附加该过滤器的名称

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    const ACTIVED = '1';

    public function scopePopular(Builder $query){
        return $query->where('views','>','0')->orderBy('views','desc');
    }

    public function scopeActive(Builder $query){
        // 这里需要添加一个 status 字段
        // php artisan make:migration alter_posts_add_status --table=posts
        // 编写迁移 $table-boolean()->nullable()->comment('状态')
        // $table->dropColumn('status')
        return $query->where('status',Post::ACTIVED);
    }
}
```

然后调用对应的查询规则即可

```php
public function post(Request $request){
    $posts = Post::active()->popular()->get();
    dd($posts);
    return 'post modle';
}
```

#### 动态作用域

所谓动态作用域指的是在查询过程中动态设置预置过滤器的查询条件

在模型类中如下定义
```php
public function scopeOfType(Builder $query, $type)
{
    return $query->where('type', $type);
}
```

调用时动态传参

```php
$posts = Post::active()->ofType(Post::Article)->get();
```

### 模型事件

在 Eloquent 模型类上进行查询、插入、更新、删除操作时，会触发相应的模型事件（关于事件我们后面会单独讲），不管你有没有监听它们。这些事件包括：

 - retrieved：获取到模型实例后触发
 - creating：插入到数据库前触发
 - created：插入到数据库后触发
 - updating：更新到数据库前触发
 - updated：更新到数据库后触发
 - saving：保存到数据库前触发（插入/更新之前，无论插入还是更新都会触发）
 - saved：保存到数据库后触发（插入/更新之后，无论插入还是更新都会触发）
 - deleting：从数据库删除记录前触发
 - deleted：从数据库删除记录后触发
 - restoring：恢复软删除记录前触发
 - restored：恢复软删除记录后触发

#### 通过静态方法监听

重写事件服务供应商的 boot 方法

```php
public function boot()
{
    parent::boot();

    User::retrieved(function($user){
        Log:info('从模型中获取用户:['. $user->id . ']' . $user->name);
        // 接下来的user 表的查询都会被记录到 storage/log/ 里面去
    });
}
```

#### 通过订阅者监听模型事件

```txt
模型类-> [ 模型类与自定义事件建立对应关系 ] <-对应事件类-> 注册至监听器类

+------------------------+           +----------------------+
| EventServiceProvider   +---------->+UserEventSubscriber   |
+------------------------+           +----------------------+
                                     +------------------+
                                     |UserDeleting      | <------ +---------------+
                                     |                  |         |User           |
                                     |Userdeleted       | ------> +---------------+
                                     +------------------+
```

EXAMPLE 初始化事件类

```bash
php artsian make:event UserDeleting
php artisan make:event UserDeleted
```

接下来在 `app\Events` 看到事件类,在这两个类的构造中中传入 `$user`

```php
public $user;
public function __construct(User $user){
    $this->user = $user
}
```

在模型类中建立与事件类的映射

```php
protected $dispatchesEvents = [
    'deleting'=>UserDeleting::class,
    'deleted'=>UserDeleted::class,
];
```

为模型类创建事件订阅者类

```php
<?php

namespace App\Listeners;

use App\Events\UserDeleting;
use App\Events\UserDeleted;
use Illuminate\Support\Facades\Log;

class UserEventSubscriber
{
    public function onUserDeleting($event)
    {
        Log::info('用户即将删除[' . $event->user->id . ']:' . $event->user->name);
    }
    public function onUserDeleted($event)
    {
        Log::info('用户已经删除[' . $event->user->id . ']:' . $event->user->name);
    }
    public function subscribe($events)
    {
        $events->listen(
            UserDeleting::class,
            UserEventSubscriber::class . '@onUserDeleting'
        );

        $events->listen(
            UserDeleted::class,
            UserEventSubscriber::class . '@onUserDeleted'
        );
    }
}
```

注册订阅者

```php
// app/Providers/EventServiceProvider.php
protected $subscribe = [
    UserEventSubscriber::class,
];
```

#### 通过观察者监听模型事件

创建针对`User`模型的观察者

```bash
php artisan make:observer UserObserver --model=User
```

生成如下`app\Observers`
只需要填充对应的事件即可

```php
<?php

namespace App\Observers;

use App\User;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    public function created(User $user)
    {
        Log::info();
    }

    public function updated(User $user)
    {
        //
    }

    public function deleted(User $user)
    {
        //
    }

    public function restored(User $user)
    {
        //
    }

    public function forceDeleted(User $user)
    {
        //
    }
}
```

在`User`模型上注册观察者即可生效
在`EventServiceProvider`中的`boot`方法中注册

```php
public function boot()
{
    parent::boot();
    User::observe(UserObserver::class);
}
```

### 模型关联关系

#### 一对一

##### 建立关联关系

键入命令`php artisan make:model UserProfile -m` 同时创建迁移 与 模型
编辑表字段
```php
public function up()
{
    Schema::create('user_profiles', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('user_id')->unsigned()->default(0)->unique();
        $table->string('bio')->nullable()->comment('个性签名');
        $table->string('city')->nullable()->comment('所在城市');
        $table->json('hobby')->nullable()->comment('个人爱好');
        $table->timestamps();
    });
}
```

在`User`模型类中创建与`UserProfile`关联的方法

```php
// app\User.php
public function profile(){
    return $user->hasOne(UserProfile::class);
}
```

然后在查询时调用

```php
 // UserController.php
public function profile(){
    $user = User::findOrFail(2);
    $profile =  $user->profile;
    dd($profile);
}
```

**在关联关系的建立过程中，Eloquent 也遵循了「约定大于配置」的原则**hasOne 方法的完整签名是：

`public function hasOne($related, $foreignKey = null, $localKey = null)`

第一个参数是关联模型的类名，第二个参数是关联模型类所属表的外键，这里对应的是 user_profiles 表的 user_id 字段，第三个参数是关联表的外键关联到当前模型所属表的哪个字段，这里对应的是 users 表的 id 字段。为什么我们不需要指定 Laravel 就能完成这种关联呢，这是因为如果没有指定 $foreignKey，Eloquent 底层会通过如下方法去拼接：

```php
public function getForeignKey()
{
    return Str::snake(class_basename($this)).'_'.$this->getKeyName();
}
```

##### 建立相对关联关系

使用`belongsTo`方法建立一对一的关联关系

```php
// app\UserProfile.php
public function user()
{
    return $this->belongsTo(User::class);
}
```

使用关联方法名作为动态属性即可访问该模型所属的`User`模型实例

```php
$profile = UserProfile::findOrFail(2);
$user = $profile->user;
```

`belongsTo` 其完整方法签名如下：

```php
public function belongsTo($related, $foreignKey = null, $ownerKey = null, $relation = null)
```

`$foreignKey`是当前模型类所属表的外键,即`user_profile`表的`user_id`字段
`$ownerKey`是关联模型类所属表的主键 `user`表的`id`
`$relation`默认约定是对应关联关系方法名,这里是`user`


**注意: 这里的方法名需要与当前关联模型所属表的主键一致,因为 $relation 变量取的是当前关联关系的方法名,所以如果你需要定义语义化的关联关系方法名,就需要输入 `belongsTo`的参数**

#### 一对多

返回模型类集合

##### 建立关联关系

通过`hasMany`方法实现

```php
// User.php
public function posts(){
    return $this->hasMany(Posts::class);
}
```

然后通过动态属性的方式查询:

```php
$user = User::findOrFail(1);
$posts = $user->posts;
```

##### 建立相对关联关系

```php
// Post
public function author(){
    // 由于 方法名改为 author 不再遵循 约定.所以belongsTo的参数需要手动传入
    return $this->belongsTo(User::class,'user_id','id','author'); 
}
```

进行关联查询

```php
public function user_mm(){
    $post = Post::find(6);
    $author = $post->author;
    dd($post,$author);
}
```

##### 渴求式加载

之前的关联关系查询都是通过动态属性查询,也可以称为*惰性加载*,用到的时候才去查询就意味着需要多次对数据库进行查询才能返回需要的结果.如果是单条记录获取关联关系就需要两次查询;如果是多条记录获取关联关系,就需要*N+1*次查询才能返回需要的结果

使用`with`方法将需要查询的关联关系动态属性传入该方法,并将其链接到模型原有的查询中,就可以一次完成关联查询,加上模型自身查询,总共查询两次.这种查询方式被称为*渴求式加载*

查询所有需求数据,然后根据需求取其中的关联数据

```php
public function user_mm(){
    $post = Post::with('author')
    ->where('views','>',0)
    ->offset(1)
    ->limit(10)
    ->get();

    $author = $post[6]->author;

    dd($post[6],$author);
}
```

#### 多对多

多对多需要借助一张中间表才能建立关联关系.对于文章表`post`还需要一张`tag`表和`post_tag`表

```bash
php artisan make:model Tag -m
php artisan make:model PostTag -m
```

填充 `tag` 迁移

```php
public function up()
{
    Schema::create('post_tags', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->integer('post_id')->unsigned()->default(0);
        $table->integer('tag_id')->unsigned()->default(0);
        $table->unique(['post_id','tag_id']);
        $table->timestamps();
    });
}
```

填充`post_tag`迁移

```php
public function up(){
    Schema::create('post_tags', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->integer('post_id')->unsigned()->default(0);
        $table->integer('tag_id')->unsigned()->default(0);
        $table->unique(['post_id','tag_id']);
        $table->timestamps();
    });
}
```

创建填充器类与填充工厂类

```bash
php artisan make:seeder TagTableSeeder
php artisan make:seeder PostTagTableSeeder
php artisan make:factory TagFactory --model=Tag
php artisan make:factory PostTagFactory --model=PostTag
```

定义工厂函数产出

```php
// TagFactory.php
$factory->define(Tag::class, function (Faker $faker) {
    return [
       'name'=>$faker->name, 
    ];
});

// PostTagFactory.php

$factory->define(PostTag::class, function (Faker $faker) {
    return [
        "post_id"=>$faker->unique(true,20000)->numberBetween(0,10),
        'tag_id'=>$faker->unique(true,20000)->numberBetween(0,10),
    ];
});
```

然后在各自的填充器类中实现工厂函数

在模型`Post`中定义`tags`方法

```php
public function tags(){
    // 建立 post_tags 表与 post 和 tag 表之间的关联
    return $this->belongsToMany(Tag::class,'post_tags');
}
```

在控制层中进行查询

```php
public function tags(){
    $posts = Post::find(9);
    $tag = $posts->tags;
    dd($tag);
}
```

或是**渴求式**查询

```php
public function tags(){
    // with 的唯一参数 $relations 是当前 Post 模型的关联查询方法名
    $posts = Post::with('tags')->find(9);
    $tag = $posts->tags;
    dd($tag);
}
```

##### 多对多关联查询的底层约定

`beloangsTo`方法签名:

```php
public function belongsToMany($related, 
$table = null, 
$foreignPivotKey = null, 
$relatedPivotKey = null, 
$parentKey = null, 
$relatedKey = null, 
$relation = null)
```

 - `$related` 关联模型类名,当前是 `Post`关联`Tag`
 - `$table` 多对多关联的中间表名 `post_tags`
 - `$foreignPivotKey` 中间表的当前模型外键`post_id`
 - `$relatedPivotKey` 中间表当前关联模型的外键`tag_id`
 - `$parentKey` 对应当前模型的哪个字段`id`
 - `$relatedKey` 对应当前关联模型的哪个字段`id`
 - `$relation` 表示关联关系名称,默认为当前关联方法名`tags`


##### 多对多的相对关联关系

在多对多关联关系中双方是对等的,不存在归属关系,所以对应查询只需要在`Tag`模型中创建查询方法即可

```php
public function posts(){
    return $this->belongsToMany(Post::class,'post_tags');
}
```

##### 获取中间表字段

```php
public function tags()
{
    return $this->belongsToMany(Tag::class, 'post_tags')
                ->withTimestamps();

    // or 获取 user_id 字段值
    ->withPivot('user_id')->withTimestamps();
}
```

##### 自定义中间表模型类

中间表模型类继承自 Illuminate\Database\Eloquent\Relations\Pivot，Pivot 也是 Eloquent Model 类的子类，只不过为中间表操作定义了很多方法和属性，比如我们创建一个自定义的中间表模型类 PostTag

```php
namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PostTag extends Pivot
{
    protected $table = 'post_tags';
}
```

## Telescope 安装

注：Telescope 要求 Laravel 5.7.7+ 版本。你可以通过 php artisan --version 查看自己的 Laravel 版本。

你可以使用 Composer 来安装 Telescope 到 Laravel 项目：

`composer require laravel/telescope`

安装完成后，使用 Artisan 命令 telescope:install 发布其公共资源，然后运行 migrate 命令执行数据库变更：

```bash
php artisan telescope:install
php artisan migrate
```

更新 Telescope

更新 Telescope 的时候，需要重新发布公共资源：

```bash
php artisan telescope:publish
```

### 只在指定环境安装
如果你计划只在本地开发环境安装 Telescope，可以在安装的时候使用 --dev 标记：

`composer require laravel/telescope --dev`

安装完成后，需要从 app 配置文件中移除 TelescopeServiceProvider 服务提供者的注册。取而代之地，要手动在 AppServiceProvider 的 register 方法中注册它：

app\Providers\AppServiceProvider.php

```php
/**
 * Register any application services.
 *
 * @return void
 */
public function register()
{
    if ($this->app->isLocal()) {
        $this->app->register(TelescopeServiceProvider::class);
    }
}
```

### 配置
发布完 Telescope 的公共资源后，它的配置文件位于 config/telescope.php。该配置文件允许你配置监听选项 watchers，每个配置项都包含其用途说明，所以建议你使用 Telescope 之前通篇读一下这个配置文件。

如果需要，你可以完全禁止 Telescope 的数据收集功能，通过配置项 enabled 来设置即可：

`'enabled' => env('TELESCOPE_ENABLED', true),`
数据清理
如果没有清理的话，telescope_entries 表会迅速累积记录。要缓解这一现状，需要通过调度任务每天运行 Artisan 命令 telescope:prune 来清理老数据：

`$schedule->command('telescope:prune')->daily();`
默认情况下，所有 24 小时之前的数据都会被清理，你可以在运行上述命令的时候使用 hours 选项来决定要保存多长时间以内的 Telescope 数据。例如，下面这个命令将会删除所有 48 小时以前创建的数据：

`$schedule->command('telescope:prune --hours=48')->daily();`
后台授权
**Telescope 可以通过 /telescope 后台访问**。和 Horizon 一样，默认情况下，你只能在本地开发环境（local）下访问。在你的 app/Providers/TelescopeServiceProvider.php 文件中，有一个 gate 方法，通过该访问控制方法，可以配置哪些用户可以在非本地环境访问 Telescope 后台，你可以根据需要随时修改该方法，以便限制对 Telescope 的访问：

```php
/**
 * Register the Telescope gate.
 *
 * This gate determines who can access Telescope in non-local environments.
 *
 * @return void
 */
protected function gate()
{
    Gate::define('viewTelescope', function ($user) {
        return in_array($user->email, [
            'taylor@laravel.com',
        ]);
    });
}
```

### 访问

本地服务的域名加上`/telescope`的路由

`localurl/telescope`













































# FAQ

1. `SQLSTATE[HY000\] [2002] Connection refused`

可能是配置文件缓存问题

```bash
php artisan cache:clear
php artisan config:cache
```

可能问题得不到解决

```bash
php artisan optimize:clear
```

2. 没有 现有目录储存/日志且不可构建:权限被拒绝

```php
php artisan optimize:clear
```

清除所有缓存,但是可能导致其它问题

3. `(PDOException(code: HY000): SQLSTATE[HY000]: General error: 1364 Field 'title' doesn't have a default value at`

将`database`文件中`sql`配置项的`strict`严格改为false







