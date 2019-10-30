---
title: TypeScript
date: 2019-08-16
categories:
 - 前端
tags:
 - 全部
 - 前端
 - TypeScript
---

> JavaScript的强类型语言。

> JavaScript的超集。

> 同样比较好的还有[Flow](https://flow.org/en/) :fire:

<!-- more -->

## 原始数据类型

```typescript
// Boolean
let boolean:boolean = true
let boolean_two:boolean = Boolean(1) 
let boolean_obj:Boolean = new Boolean(1) // ! 返回一个 boolean 对象
// Number
let nan:number = NaN;
let infinity:number = Infinity;
// Void
let fun = ():void => {
	/**
	 * ! void 一般用于表示 undefined null 但是用于 variable 毫无意义，所以一般用于函数返回值类型声明
	 */
}  
// Null 和 Undefined
let nu:null = null
let un:undefined = undefined // ! null 和 undefined 可以使用 原始类型定义也可使用 void 类型
// Any
let any:any = 1
	any = true // ! any 代表任意类型，不做类型约束，也等价于未声明类型
/**
 * 1. 变量在声明时赋值，会被推测类型，根据赋值类型
 * 2. 声明时不赋值就会推导为任意类型
 */
```

## 联合类型

```tsx
 /**
  * 1. 联合类型代表允许值为类型中的任意一种
  * 2. 联合类型上的属性或方法必须为所有的联合类型所共有的。如果有一个联合类型不具有该属性或方法就会报错。
  */
 let key:number | string;
```

## Interface

```tsx
 // Interface
 /**
  * 1. 接口用于制定实现的规则
  * 2. 一个对象是某种接口类型的那么就必须也只能实现该接口的属性
  * 3. 当然你也可以添加可选属性
  * 4. 也允许出现任意属性
  * 5. 如果任意属性的 value 指定了确切的类型，那么确定属性和可选属性的类型都必须是它类型的子集
  */
 interface Person {
	 readonly id:number,
	 name:string,
	 age:number,
	 sex?:boolean, // ? 定义只读属性，只读属性只允许在创建时被赋值
	[propsName:string]:any, // ? key 为 string 类型，value 为任意类型
 }

 let tom:Person = {
	 id:4343, // 只读属性必须在初始化时赋值
	 name:'tom',
	 age:25, 
	 sss:12, // 
 }

 tom.id = 121212  // error ：只读属性，不可初始化后赋值
```

## 数组类型

```tsx
// Array

 let arr_n:number[] = [1,2]
 let arr_s:string[] = ['1','2']

 interface __number_arr {
	[index:number]:number // 使用借口规定数组的下标和值
 }
 let arr_interfac:__number_arr = [1,2]

 /**
  * 1. 类数组都有自己的接口定义，不可使用普通的数组接口实现
  */

  function sum(){
	  let args:IArguments = arguments;
  }
```

## 重载

```tsx
// 重载 
/**
 * Overload 重载是依据参数的不同定义不同的函数逻辑与返回值
 * Overidee 重写是具有相同的参数与返回值但是逻辑不同
 * @param x 
 */
function overload(x:number):number;
function overload(x:string):string;
function overload(x:string | number):string|number{
	/**
	 * 1. 前两个函数形式为函数定义,确定当输入何种类型时该返回何种类型的值
	 * 2. 第三个为函数的实现
	 */
	return 1
}
```

## 断言

```tsx
// 断言

function assert(some:string|number):string|number{
	// 断言仅允许联合类型之一
	if( (<string>some).length){
		// 断言 some 为 string类型时进入逻辑段
	}else{
		return some
	}
}
```

## 声明文件

在这里搜索第三方声明文件[TypeSearch](https://microsoft.github.io/TypeSearch/)

[声明文件](https://ts.xcatliu.com/basics/declaration-files)

## 类型别名

```tsx
type Name = string
type Resolver = () => string // 作用同上
type NameOrResolver = Name | Resolver
```

## 字符串字面量类型

```tsx
type NAME = 'zhou' | 'liu' | 'wang'

function check(name:NAME){ // 约束name的值需要为 以上三种之一
}
```

## 元组

```tsx
// 元组

let tuple:[string,number];

tuple[0] = 'zhou'; // 元素允许单个下标赋值
tuple = ['zhou',34]; // 但是当你 对元组变量进行初始化赋值时需要提供元组类型中指定的所有项

tuple.push(12); // 允许越界,但是越界元素的类型仅属于联合类型之一
```

## Class

**ES6 的class**

```typescript

class Animal {

	constructor(name,sex){
		this.name = name
		this.sex = sex
	}

	static DNA = 'fhjjHJHF9y9HFhugfgG9F9gh9GHUYGH99uGGHh98fajkj9Y7UF98';
	static mutation(){

	}

	sayHi(){
		console.log(`my name is ${this.name}`)
	}

	get name(){
		return this.name
	}

	set name(__name){
		this.name = __name
	}
}

class People extends Animal{

	constructor(name,sex,id){
		this.id = id
		super(name,sex)
	}

	sayHi(){
		console.log('my...')
		super.sayHi()
	}

}

```

**TypeScript 的Class**

```typescript

class Animal{
	public name:string;
	private sex:number; // 只可被类的内部定义访问
	protected id:number; // 允许被子类访问
	public constructor(name:string,sex:number){
		this.name = name;
		this.sex = sex
	}

	public sayHi():string{
		return '';
	}
}

```

**TypeScript 的抽象类**

```typescript

abstract class Animal{
	public name;
	public constructor(name){
		this.name = name
	}
	public abstract sayHi(){

	}
}

```

> 抽象类中的抽象方法必须被子类实现

## Class Interface

类的接口是对不同类之间共同点的提取,可以提高类的灵活性.

```typescript

interface Instinct{
	eat();
	drink();
}

interface Life extends Instinct{
	play()
}

interface Exercies{
	Run();
	Swimming();
}

class People implements Life,Exercies{

}

interface Counter{
	(start:number):string;
	interval:string,
	reset():void;

	/*
	1. 接口可以继承接口和类
	2. 接口可以定义一个函数上的属性与方法
	*/
}

function getCounter():Counter{
	let counter = <Counter>function(start:number){ };
	counter.interval = 123
	counter.reset = function() { };
	return counter;
}

```

## 泛型

```typescript

function createArray<T>(length:number,value:T):Array<T>{
	let result:T[] = [];
	return result;
}

```

> `T`用来指代 value 输入的类型,如果用户输入 value 为 string 类型 那么 对 result 数组的类型就约束为 string 类型

```typescript

function swap<T,U>(tuple:[T,U]):[U,T]{
	return [tuple[1],tuple[0]];
}

```

> 允许定义泛型时一次定义多个类型的参数

```typescript

interface Lengthwise{
	length:number;
}

function swap<T extends Lengthwise>(arg:T):T{
	return arg.length;
}

```

> 以上接口约束了泛型的参数必须包含 length 属性,这样就确保 arg 在使用 length 属性时不会报错.

**泛型接口**

```typescript

interface CreateArray{
	<T>(length:number,value:T):Arrau<T>;
}

interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

```

**泛型类**

```typescript

class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let generic_number = new GenericNumber<string>();

```

**泛型参数默认值**

```typescript

function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

```

> 当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。