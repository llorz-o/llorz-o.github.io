---
title: python入门篇
date: 2019-07-08
tags:
 - Python
 - 后端
 - 入门
 - 全部
categories:
 - 后端
---

## Hello World

### python交互模式

![python交互模式](http://yanxuan.nosdn.127.net/32cc70fb66ef973b600cfee7dd43f7a7.png)

使用`python`执行 `py` 交易

```powershell
# hello_world.py
# print('hello world')
cd d:/workproject/python> python hello_world.py
# 想要通过交互模式运行py文件需要运行时的py路径指向正确
# 单次运行py该文件代码一次执行，而交互模式一行一行的执行，主要用作调试
```

### 输入与输出

#### input()

`input()`函数用于接收交互模式的输入

```shell
>>>name = input() # 执行到这一句时交互命令行就会等待你的输入，最终的结果会被赋值给name变量
zhoulichao

# 注意 input() 只能接受为 字符串类型，即输入 1000 ，也是字符串类型的 1000
```

#### print() 

`print()` 函数用于输出到控制台，逗号间隔会被输出为空格

```shell
print('ni','hao')
>>>ni hao
print('1',end='') # 代表在结尾追加end 的值，并下一个 print 不换行，接着结尾输出
```

## 基础

### 基础数据

- 整型：int 支持二到十六进制的换算表示,`0x5fad5c`16进制需要`0x`前缀开头

- 浮点：1 * 10 ^ 9 科学计数法表示为 1.23e9

- 字符串： 字符串还有原始字符串表示法、字节字符串表示法、Unicode字符串表示法 

  - 多行字符串：使用`'''...'''`输出多行字符串

  ```python
  print('''
  ...123
  ...456
  ''')
  ```

  - 转义：默认遵循转义，也可使用`r'  '`来表示字符串不使用转义

  ```python
  print(r"\\\\\n\n")
  ```

- 布尔：使用 `Ture` `False` 大写表示。与或非，`and or not` 。`not`是单目运算符，可用于转换`true` 与`false`的状态,如：`not True`或`not 1 > 2`

- None:`None` 是一个特殊的空值

#### 变量

```python
a = 123
a = '123' # 此时的a为动态类型，可被任意赋值
int b = 123 # b 是一个整型，只能被赋值整型
```

`python`中的变量赋值与`js`有很大的不同

```python
a = 1
b = a
a = 2

print(b) # => 1
# python中的变量赋值是将变量的值进行赋值
```

#### 变量命名

`python`中的变量命名与`js`中没什么不同，除了：

- 受保护的实例属性用单个下划线开头 
- 私有的实例属性用两个下划线开头 

#### 编码问题

`python`的字符串类型是`str`在内存中以`unicode`表示，一个字符对应若干字节，如果要在网络上传输，或保存在磁盘上，就需要把`str`转换为以字节为单位的`bytes`

```python
a = b'abc'
# bytes 的每个字符只占用一个字节
'abc'.encode('ascii')
# 使用encode() 方法可以将str编码为指定的bytes
```

**注意** 中文无法使用`ascii`编码,中文超出了编码范围,可使用`decode`将`bytes`转换为字符

```python
b'abc'.decode('utf-8',errors='ignore')
# 如果bytes中只有一小部分无效的字节，可以传入errors='ignore'忽略错误的字节
```

使用`len()`计算字节或字符的长度

```python
len('我不是') 
len('我不是'.encode('utf-8'))
# 传入的为字符则输出字符长度，字节则输出字节长度
```

**注意** 在操作字符串时，我们经常遇到`str`和`bytes`的互相转换。为了避免乱码问题，应当始终坚持使用UTF-8编码对`str`和`bytes`进行转换。 

- 在文件头写入注释字段

```python
# !/user/bin/env python3
# -*- coding: utf-8 -*-
```

第一行注释是为了告诉Linux/OS X系统，这是一个Python可执行程序，Windows系统会忽略这个注释；

第二行注释是为了告诉Python解释器，按照UTF-8编码读取源代码，否则，你在源代码中写的中文输出可能会有乱码。

- 确保你的编辑器的编码格式为 `utf-8`

#### print()占位符

```js
# 使用占位符在 字符串中插入变量，或特殊值
print('%d %f %s %x %%' % (3,1.10002,'我是谁',0xdcf5))
# ==> 3 1.100020 我是谁 dcf5 %

# %s 可以输出任何数据类型
# 想要输出 % 就要使用 %% 转义
# 使用 %.2f 表示输出2位小数点

print('%2d - %02d' % (3, 1)) # ==> 3 - 01
# 整数补0，%02d 表示在补0后长度为 2 位数

```

### 集合

#### list 无序集合

```python
list = ['a','b','c']

print(list[0]) # a

#确保数据不越界
list[ len(list) - 1 ]
# or 
list[ -1 ]
```

- `list.append('d') `追加
- `list.insert(1,'1')` 插入
- `list.pop()` 删除末尾 or `list.pop(0)` 删除指定位
- `list[0] = 'a'` 替换
- list 内部可已包含不同类型的值，或是一个list

#### tuple 无序集合

tuple 初始化后不可修改

```python
t = (1,) # 如果定义一个元素必须使用 ， 消除歧义
# 因为 () 同样作为块输出语句，但是 t = () 却表示空tuple

t = (1,['a','b'])
t[1][0] = 'c' # tuple 本身不可变，但是如果包含 list 那么list的内容是可变的，因为 tuple 保证指向不变
```

### 条件判断

```python
birth = 1996

if birth < 2000:
    print('00前')
elif:
    print('00后')
else:
    print('???')
    
# 注意比较时需要保证比较的变量类型一致
```

### 循环

#### for \<item\> in \<container\>

```python
names = ['a','b','c']

for name in names：
	print(name)
```

##### range

```python
for i in range(100)

range(5) # range(0, 5)
list(range(5)) # [0, 1, 2, 3, 4]
```

- `range(101)`可以产生一个0到100的整数序列。
- `range(1, 100)`可以产生一个1到99的整数序列。
- `range(1, 100, 2)`可以产生一个1到99的奇数序列，其中的2是步长，即数值序列的增量。

#### while

```python
n = 1
while n < 100:
	print(n)
	n = n + 1
	if n > 10:
		break
	if n > 5:
		continue
print('END')
```

- break 推出当前循环
- continue 跳出当前
- 请避免使用 `break` 和 `continue`

### 键值对(字典，map)

#### dict 

```python
map = {
	'name':'zhoulichao',
	'age':23,
	'sex':'male'
}

print( map['sex'] ) # male
map['sex'] = '男'
print( map['sex'] ) # 男

'sex' in map # 判断 k 是否存在
# or
map.get('sex', -1) # 如果不存在 返回指定的 -1
```

- `dict.pop(k)`删除指定键值对
- `dict` 查找和插入的速度极快，不会随着key的增加而变慢；
- 需要占用大量的内存，内存浪费多。`dict`是一种空间换时间的储存结构
- `dict` 的 `k `必须是不可变的

#### set 

`set` 是一组 `k` 的集合，它不储存 `v`，类似 `js` 中的 `set` ，无法填充重复` k`

```python
s = set([1,2,3])
```

- `add('a')`
- `remove('a')`
- 和 `dict` 一样 `set `也是 `hash` 表 ，所以`key` 也不可变

## 函数

```python
def me_abs(x):
	if x < 0:
		return x
	elif x < 50:
		return
	else:
		pass

a = int(input('输入目标值'))

b = me_abs(a)

print(b)
```

- `return` 空，等于`return None`
- `pass` 代表代码块占位符,如果你暂时不知道在代码段内写什么，可以先写个`pass`避免报错
- python 的参数是位参，也是必选参数

### 参数检查 isinstance

```js
def fun(x):
	if not isinstance(x,(int,float)):
		raise TypeError('请检查参数')
```

### 返回多个值

```python
def fun(x):
	return x + 1,x * 2

x,y = fun(12)
# 返回值类似 js 的解构
```

### 默认参数

```python
def fun(a,b = 2,c = 'c'):
    
fun(1,c='cc') # 指定部分默认参数
```

- 默认参数必须定义在必选参数后面，因为默认参数可以不传，如果默认参数定义在前，在默认参数丢失时会导致必选参数丢失的问题
- 不要在默认参数使用非基本类型，如：`(a = [])`,这样函数会记住该`list`,最后的结果就是，后面每一次调用使用的都是同一个 `list`

```python
# 使用如下方式解决
def fun(a = None):
    if a is None:
        a = []
```

### 可变参数

```python
def calc(*numbers): #参数numbers接收到的是一个tuple
    
calc(1,1,4,3) # 调用时可传入任意个数的参数

# 或者传入一个 list 或 tuple
a = [1,1,2,34,5]
calc(*a) # 注意这里的星号 类似 js 中的扩展符 (...a)
```

### 关键字参数

```python
def fun(name,age,**arg):

fun('name',23,city='beijin',address='qilitun')

# 关键字允许使用者除了传入必选从参数外，还可传入任意的关键字参数。

m = {
    'city':'beijin',
    'address':'sanlitun'
}

fun('name',23,**m)
```

- 函数内部获取到的只是一个引用，可以随便折腾
- 命名关键字参数只允许传入许可的关键字参数

```python
def fun(name,age,*,city,address) # 命名关键字参数需要一个特殊分隔符*，*后面的参数被视为命名关键字参数。
def fun(name,age,*args,city,address) # 如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符 *

```

- 命名关键字参数必须传入参数名 
- 如果没有可变参数，就必须加一个`*`作为特殊分隔符。 

```python
args = (1,2,3,4)
kw = {'a':1}

def fun(a,b,c=0,*args,**kw)

fun(*args,**kw) # 你也可以通过这种方式调用
```

### 递归函数

```python
# 普通递归函数在 return的时候包含表达式，会形成入栈，当递归次数过多会导致栈的溢出问题（栈的大小不是无限的）
def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)

# 使用尾递归优化，这种递归只会形成一次入栈
```

- Python解释器也没有做优化，所以，即使把上面的`fact(n)`函数改成尾递归方式，也会导致栈溢出。 

## 高级特性

### 切片

```python
# 一般用于取集合截断数据，相当于 js 中的slice
a = [1,2,3,4,5]
a[0:1] # => 1 取0到下标1 ，但不包括1
a[-2:] # 4,5
a[-2:-1] # 4
a[:5] # [0,1,2,3,4]
a[:5:2] # [0,2,4] 前五个，隔二取1
a[::2] # 所有值隔二取1
a[:] # 复制
(1,2,3,4,5)[:2] # tuple 也可以做切片
'abcdef'[:2] # 字符串也是 
```

### 迭代

```python
m = {
    'a':1,
    'age':23,
    'gender':'male'
}

for k in m:
    print(k)
    
# or
for v in m.values():
    print(v)

# or
for k,v in m.items():
    print(k,v)
    
# 判断对象是否可迭代
from collections import Iterable
isinstance('abc',Iterable)
# True

# 迭代 list 的下标
for i,v in enumerate(['a','b','c'])
# 0 a

for x,y in [(1,2),(3,4)]
# 1 2
```

### 列表生成式

```python
[x * x for x in range(1, 11)]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

[x * x for x in range(1, 11) if x % 2 == 0]
# [4, 16, 36, 64, 100]

[m + n for m in 'ABC' for n in 'XYZ']
# ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']

d = {'x': 'A', 'y': 'B', 'z': 'C' }
[k + '=' + v for k, v in d.items()]
# ['y=B', 'x=A', 'z=C']

L = ['Hello', 'World', 'IBM', 'Apple']
[s.lower() for s in L]
# ['hello', 'world', 'ibm', 'apple']
```

### 生成器 generator

```js
# generator 在循环时计算并生成内容

g = (x * x for x in range(10))
next(g) # 通过next调用下一个结果，就像 js 中部署的的 iterator 

# 正确的用法是使用 for 循环
for i in g

# 函数式的generator
def gn(max):
    n = 0
    while n < max:
        yield n * 2
        n += 1
    return 'done'
# generator 函数生成的是generator对象
# 该对象保存函数运行时的环境，通过调用 next 不断计算并依次返回一个 yield 
# generator 函数也可以直接循环结果
for i in gn(6)

# 获取 generator 函数的返回值 
g = gn(6)

while True:
    try:
    	x = next(g)
	except StopIteration as e:
		print('generator 返回值',e.value)
		break
```

### 迭代器

已知可直接用于`for`循环的数据类型有:

- 集合数据类型，如`list`、`tuple`、`dict`、`set`、`str`等； 
- `generator`，包括生成器和带`yield`的generator function。 

这些可以直接作用于`for`循环的对象统称为可迭代对象：`Iterable`。 

```python
# 使用isinstance()判断一个对象是否是Iterable对象
from collections import Iterable
isinstance([],Iterable)
```

可以被`next()`函数调用并不断返回下一个值的对象称为迭代器：`Iterator`。 

```python
# 可以使用isinstance()判断一个对象是否是Iterator对象：
from collections import Iterator
isinstance((x for x in range(10)),Iterator)
```

#### iter()

`list`、`dict`、`str`虽然是`Iterable`，却不是`Iterator`。

把`list`、`dict`、`str`等`Iterable`变成`Iterator`可以使用`iter()`函数

```python
isinstance(iter([]),Iterator) # True
```

> 凡是可作用于`for`循环的对象都是`Iterable`类型；
>
> 凡是可作用于`next()`函数的对象都是`Iterator`类型，它们表示一个惰性计算的序列；
>
> 集合数据类型如`list`、`dict`、`str`等是`Iterable`但不是`Iterator`，不过可以通过`iter()`函数获得一个`Iterator`对象。

## 函数编程

### map

`map`函数返回一个 `Iterator`

```python
def f(x):
    return x + 1

v = map(f,[1,2,3,4,5,6,7,8])

print(list(v)) #  使用list 序列化一个 Iterator
```

### reduce

```python
def rd(x, y):
    return x + y

print(reduce(rd, [1, 2, 3, 4, 5, 6, 7, 8, 4, 0]))
```

### filter

```python
ls = [1,2,3,4,5,6]

def is_a(x):
    return x % 2 == 0

print(list(filter(is_a,ls)))

# 过滤空字符
def not_empty(s):
    return s and s.strip()

list(filter(not_empty, ['A', '', 'B', None, 'C', '  ']))
```

### sorted

```python
exp = [-56,34,6,34,5,-90,0,8,-23,-3]

sorted(exp)

# 可以传入第二参数指定排序方式
sorted(exp,key=abs)

# 注意英文字母的排序
# 在 ASCII 码中大写字母的位序是小于小写英文字母的，所以英文排序会出现 C < a 的情况，使用lower 函数处理
sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower)

# 反向排序
sorted(exp,reverse=True)
```

### 返回函数

在函数中返回一个函数，类似 `js`

```python
def calc(*nums):
    def sun():
        rs = 1
        for i in nums:
            rs = rs * i
        return rs
    return sun

s1 = calc(1,2,3,4,5,6)
s2 = calc(1,2,3,4,5,6)

print(s1()) # 720
print(s2())	# 720
print(s1 == s2) # Flase 即便参数相同返回的也不是同一个函数
```

`python` 与` js` 一样具有闭包的概念

### 匿名函数

```python
ls = [1,2,3,4,5,6,7,8]

list(map(lambda x: x * x,ls))

# lanbda 等同于如下
def f(x):
    return x*x
```

关键字`lambda`表示匿名函数，冒号前面的`x`表示函数参数。 

匿名函数有个限制，就是只能有一个表达式，不用写`return`，表达式的结果就是返回值

```python
x = lambda x: x*x # 这样也行
```

### 装饰器

```python
# 将函数赋给变量
def now():
    	print('2016-05-19')
f = now
f()
# 使用 __name__ 属性获得函数名
now.__name__
```

使用装饰器`decorator`

```python
def log(fun):
    def wrapper(*args,**kw):
        print('call %s():' % fun.__name__)
        return fun(*args,**kw)
    return wrapper

@log
def now():
    print('2019-07-08')

now() # 在now函数执行前 log函数会先执行，并接收now函数作为参数
# @log 装饰器相当于 now = log(now)

# 如果你想往装饰器传入自定义参数
def log(text):
    def decorator(fun):
        def wrapper(*args,**kw):
            print('call %s():' % fun.__name__)
            return fun(*args,**kw)
        return wrapper
    return decorator

# 由于装饰器的原因 now 函数被重新赋值，所以now函数的 __name__ 函数签名被覆盖了

def log(text):
    def decorator(fun):
        @functools.wraps(fun) # 这里可以使用装饰器修改最后返回的函数的 签名 __name__
        def wrapper(*args,**kw):
            print('call %s():' % fun.__name__)
            return fun(*args,**kw)
        return wrapper
    return decorator
```

### 偏函数

使用偏函数用于，设定一些常用的默认函数参数，避免每次调用时都需要再写一遍默认参数

```python
int('423423',base=8) # base 用于进制转换，默认为 10 进制
# 当你需要大量使用 8 进制时，你绝对不会希望每次调用都写一个 base=8

import functools
int8 = functools.partial(int,base=8)
# 当然你仍然可以传入一个新的 base 去覆盖base=8
```

**偏函数一般用于默认值的设定，也可用作关键字参数的手动默认值**

## 模块

目录组织模块

```
mycompany
 ├─ web
 │  ├─ __init__.py
 │  ├─ utils.py
 │  └─ www.py
 ├─ __init__.py
 ├─ abc.py
 └─ utils.py
```

请注意，每一个包目录下面都会有一个`__init__.py`的文件，这个文件是必须存在的，否则，Python就把这个目录当成普通目录，而不是一个包。`__init__.py`可以是空文件，也可以有Python代码，因为`__init__.py`本身就是一个模块，而它的模块名就是`mycompany`。 

文件`www.py`的模块名就是`mycompany.web.www`，两个文件`utils.py`的模块名分别是`mycompany.utils`和`mycompany.web.utils`。 

**模块名不要以数字开头**

### 使用模块

```python
# !/user/bin/dev python3
# -*- coding utf-8 -*-

#第1行和第2行是标准注释，
# 第1行注释可以让这个hello.py文件直接在Unix/Linux/Mac上运行，
# 第2行注释表示.py文件本身使用标准UTF-8编码

' test module '
# 表示模块的文档注释，任何模块代码的第一个字符串都被视为模块的文档注释；
# 文档注释也可以用特殊变量__doc__访问

__author__ = 'zhoulichao' 
# 使用__author__变量把作者写进去
# 双下划线的为特殊变量，一般个人变量不要使用这种方式命名
# 特殊变量也属于非公开的

import sys

public = '公开变量'
_private = '私有变量'
# 非公开变量不应被直接引用，而不是不能被直接引用


def test():
    args = sys.argv
    # argv 存储了命令行的所有参数
    # argv 变量第一个参数永远是该py文件的名称
    if len(args) == 1:
        print('hello world!')
    elif len(args) == 2:
        print('hello %s' % args[1])
        # python3 hello.py Michael获得的sys.argv就是['hello.py', 'Michael]。
    else:
        print('')

if __name__ == "__main__":
    test()

# 当我们在命令行运行hello模块文件时，
# Python解释器把一个特殊变量__name__置为__main__，
# 而如果在其他地方导入该hello模块时，if判断将失败
# 注意是命令行而不是python交互环境
# 命令行 python test.py
# 交互解释器 import test

```

### 第三方模块与包管理器 pip

一般来说，第三方库都会在Python官方的[pypi.python.org](https://pypi.python.org/)网站注册，要安装一个第三方库，必须先知道该库的名称，可以在官网或者pypi上搜索，比如Pillow的名称叫[Pillow](https://pypi.python.org/pypi/Pillow/)，因此，安装Pillow的命令就是：

```
pip install Pillow
```

用pip一个一个安装费时费力，还需要考虑兼容性。我们推荐直接使用[Anaconda](https://www.anaconda.com/)，这是一个基于Python的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库，我们装上Anaconda，就相当于把数十个第三方模块自动安装好了，非常简单易用。 [国内镜像](https://pan.baidu.com/s/1kU5OCOB#list/path=%2Fpub%2Fpython) 

默认情况下，Python解释器会搜索当前目录、所有已安装的内置模块和第三方模块，搜索路径存放在`sys`模块的`path`变量中： 

```shell
>>> import sys 
>>> sys.path
['', '/Library/Frameworks/Python.framework/Versions/3.6/lib/python36.zip', '/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6', ..., '/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/site-packages']
```

添加自己的搜索目录

```python
# 直接修改sys.path，添加要搜索的目录
>>> import sys
>>> sys.path.append('/Users/michael/my_py_scripts')
# OR
# 设置环境变量PYTHONPATH，该环境变量的内容会被自动添加到模块搜索路径中。设置方式与设置Path环境变量类似。注意只需要添加你自己的搜索路径，Python自己本身的搜索路径不受影响。
```

## OOP 面向对象

```python
# class <className>(<extend>)
# className 对象使用大驼峰命名
# extend 继承自某个类，如果没有继承，就选用 object 
# 所有的对象都继承 object 类
class Student(object):
    # 特殊方法__init__ 第一个参数永远是self 指向实例
    # __init__ 方法相当于 constructor 构造器
    def __init__(self,name,age,gender):
        self.name = name
        self.age = age
        self.__gender = gender # 双下划线表明这是一个私有属性
        
    # 对象内部的方法第一个参数也是self，调用时同样可不传self，
    # self 默认传入
	def show(self):
        print('name: %s,age: %d' % (self.name,self.age))
     def get__gender(self):
        return self.__gender
bill = Student('Jeck',23)
bill.name = 'Bill'
```

### 继承与多态

```python
class People(object):

    def __init__(self,name):
        self.name = name

    def show(self):
        print('我的名字叫: %s' % self.name)

    def run(self):
        print('我跑起来了')

class Student(People):
    def run(self): # 重写 run 方法
        print('我是一名学生我也跑起来了')


bill = Student('Bill')

bill.show() #  的名字叫: Bill
bill.run() # 我是一名学生我也跑起来了

print(isinstance(bill,Student)) # True 判断实例的类型是否属于对象
print(isinstance(bill,People)) # True
```

静态语言对数据的类型具有更高的控制度，它规定了方法的调用类型，必须满足类型才能使用，如 `java`

而动态语言则不会有这种限制，只要有该方法即可调用。本质上这遵循了 "鸭辨原则"  ——“看起来像鸭子，走起路来像鸭子”，那它就可以被看做是鸭子。 

### 获取对象信息

#### type() 类型判断

```python
type(bill) # <class '__main__.Student'>

# 判断是否是函数
type(fn)==types.FunctionType
# True
type(abs)==types.BuiltinFunctionType
# True
type(lambda x: x)==types.LambdaType
# True
type((x for x in range(10)))==types.GeneratorType
# True

# isinstance 可以判断实例是否处于对象的继承链上
```

#### dir() 对象信息

```python
dir('abc')
# ['__add__', '__class__',..., '__subclasshook__', 'capitalize', 'casefold',..., 'zfill']
```

`dir()`方法返回该数据类型的对象上所有的属性与方法

`__len__`这样的特殊方法具有特殊用途，如`len()`方法会调用该参数对象上的`__len__`方法，所以你可以重写`__len__`方法.

```python
class Dog(object):
    def __len__:
        return 100
dog = Dog()
len(dog) # => 100
```

#### getattr(),setattr(),hasattr()

```python
hasattr(dog,'__len__') # 存在否
setattr(dog,'name','金毛') # 设置
getattr(dog,'name') # 得到
getattr(dog,'name','dog') # 不存在返回默认值 dog 
```

### 实例属性与类属性

```python
class Student():
    name = 'Jack' # 这种在类上设定的属性类似于 js 的原型属性
    
a = Student()
a.name # Jack
a.name = 'Ruth' # 这种设定会在实例上添加属性
a.name # Ruth
Student.name # Ruth
```

### \__slots__

```python
from types import MethodType

def set_age(self,age):
    self.age = age

a.set_age = MethodType(set_age,a) # 给实例绑定方法
# 但是该方法绑定的方法只作用于该实例

# 给类绑定方法
Student.set_age = set_age

# 使用 __slots__ 限制实例添加属性
# 同样只能限制当前类的实例，无法限制子类的
class Student(object):
    __slots__ = ('name','age') # 使用 tuple
```

###  @property

```python
# @property 装饰器用于在类创建前检查参数
class Student(object):
```



