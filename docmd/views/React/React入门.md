---
title: React
date: 2019-07-29
tags:
 - React
 - 全部
categories:
 - 前端
---

![UTOOLS1564394783810.png](http://yanxuan.nosdn.127.net/a4e2dc3612c233072ba6e70a82f59915.png)

​	自学`React`起就没再用过它，觉得挺尴尬，现在又要开始用`React`做项目了，重新复习一遍。。

<!-- more -->

先上一张图

![UTOOLS1569823234715.png](http://yanxuan.nosdn.127.net/2f854c9cae1bf4e6971a1b6da6c7ed80.png)

## React

### State & Props

1. **同时依赖`state`和`props`产生一个`setState`**

    > 因为`this.state`和`this.props`可能会异步更新,所以你需要以如下方式完成

    ```jsx
    /**
    * @param state { oldState } 上一个state的状态
    * @param props { application Props } 当前最新被应用的props
    */
    this.setState( (state,props) => ({
      counter:state.counter + props.increment
    }))

    ```

2. **不要直接修改当前组件的`props`**

    > 因为`React`是单向数据流

### 列表和key

  > 如果列表的顺序可能产生变化,不建议使用索引当作`key`的值,这样会导致性能下降官方建议使用数据中的id作为元素的key `map( v => <div key={v.id} ><div/>)`而不是索引`i`

1. 你无法在组件中通过`this.props.key`获取当前组件在列表中所在的`key`

### 组合

1. `React`中任何东西都可作为`props`进行传递,也包括组件,类似于其他组件中的插槽`slot`

	```jsx

	function List(props){
		return (<div>
			{ props.children } // 12
			{ props.ctr }
		</div>)
	}

	// 这种直接在 props.children中取子组件的方式相当于 默认的 slot
	function Item(){
		return (<List ctr={ <Ctr> }>
			12
		</List>)
	}

	function Ctr(){
		return (<div>
			ctr
		</div>)
	}

	```

### Context

> `Context`设计的目的是为了实现那些于组件树而言是'全局'的数据,从根本上避免了那些每个组件都需要的数据在每个`props`上再传递一遍的繁琐.

```jsx

import React, { Component } from 'react';

const ThemeContext = React.createContext('light'); // 默认值 'light'

class App extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		// 传递一个值 dark
		return (
			<ThemeContext.Provider value="dark">
				<Main/>
			</ThemeContext.Provider>
		)
	}
}

class Main extends Component {

	constructor(props) {
		super(props)
	}

	// 记住这是必须的,否则你无法得到 this.context
	static contextType = ThemeContext

	render() {

		console.log(this.context) // dark

		return (
			<div>
				main
				<Left></Left>
			</div>
		)
	}
}

// 或者这样 
Main.contextType = ThemeContext
```

#### Context.Consumer

```jsx
const ThemeContext = React.createContext('light'); // 默认值 'light'

function Main(props){

	return <div>
		{props} // light
	</div>
}

class App extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		// 传递一个值 dark
		return (
			<ThemeContext.Consumer>
				{
					value => {
						return Main(value)
					}
				}
			</ThemeContext.Consumer>
		)
	}
}

export default App
```

`Consumer`接收一个函数组件订阅`context`。`value`等同于距离这个`context`最近的`Provider`提供的`value`	

**注意：**为避免每一次`Provider`重渲染时，会重渲染所有下面的`consumers`组件,应以以下方式书写`value`

```jsx
// bad
class App extends Component {
	render(){
		return (<Provider value={{
			something:'something'
		}}>
			<Button></Button>
		</Provider>)
	}
}

// good
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```

将`value`提升到父节点的`state`里

#### 传递底层组件

>   将需要顶层状态的底层组件抽取出至顶层，然后一层一层的传递下去

```jsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// 现在，我们有这样的组件：
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<PageLayout userLink={...} />
// ... 渲染出 ...
<NavigationBar userLink={...} />
// ... 渲染出 ...
{props.userLink}
```

**这种情况会导致你的高层组件变得复杂起来。**

### Ref

`ref`可被组件使用指定`ref`为JSX属性而向下传递。

```jsx
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;

const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));
```

**注意：**第二参数`ref`只在`forwardRef`定义的组件时存在，普通函数和class组件不接收`ref`参数，`props`中也没有。

`ref`可以指定为回调函数

```jsx
constructor(props){
    this.refCallBack = ele => {
        
    }
}
<div ref={this.refCallBack}></div>
```

### 组件的装饰者HOC



### Fragments

`Fragment`通常用于在render中返回多个元素且不需要拥有一个顶级`DOM`元素或组件包裹的情况。

```jsx
class App extends Component {
	render(){
		return (
			<ul>
				<Column/>
				<Column2/>
			</ul>
		)
	}
}

class Column extends Component{

	render(){
        // Fragment 允许接收一个 key ，并且在最终渲染时将仅渲染内部元素。
        // Fragment 将在渲染时被忽略
		return (
			<React.Fragment key={1}>
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</React.Fragment>
		)
	}

}

class Column2 extends Component{
	render(){
        // 这种简写方式不可接收 key
		return (
			<>
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</>
		)
	}
}
```

### 权衡

`react`中的diff算法，的差异算法是基于两点来决定是否需要更新实际`DOM`

1.  两个dom元素的类型是否一样
2.  两个dom元素的key值是否一致

如果以上两点保持一致将会比较变更属性，`React`元素的动态属性变更与`props`或`state`保持关系，`react`中diff算法对比的是虚拟`DOM`也就是说，对比对象的属性变更。如果通过`DOM`方法操   作`react`渲染出来的dom属性，在`react`的重新渲染时并不会去除原来的`dom`属性。

可以通过`key={Math.random()}` 强制进行替换。

### props render 

`props render`是指一种开发模式。该模式指你可以将组件在props中传输。从而完成切面关注点开发。

```jsx
<Parent render={ children => (
    <Children>12</Children>
    ) }></Parent>
// 这里提供的是一个render方法，可由下级组件决定在何时渲染上级传入的组件
```

**注意：**`render props` 与 `React.PureComponent`在一起使用时需要注意，`render props` 将导致 `props` 的对比始终是`false`，那么 `PureComponent` 将失去它的作用。

### React.Component

**`forceUpdate()`**

```jsx
component.forceUpdate(callback)
// 该方法强制组件重渲染，调用 render()方法，但是将跳过 sholdComponentUpdate() 方法
```

**`getSnapshotBeforeUpdate（）`**

```jsx
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给 `componentDidUpdate()`的第三个参数`snapshot`

## Hook

`Hook`是在组件生命期间带入的函数，`Hook`不能再class组件中使用。所以使用`Hook`只能是函数组件。

### useState

```jsx
function List(){
    const [item,setItem] = useState('zhou');// 传入一个初始的state 值为 'zhou',属性名为 ‘item’，
    // 以及一个可以设置这个值的 函数 ‘setItem’
    
    return (
    <div onClick={ () => setItem('liu')}></div>
    )
}
```

### useEffect

```jsx
useEffect(() => {
    // 任务
    return () => {
        // useEffect 接受一个函数返回值，在组件卸载时完成调用
    }
},[count]) // 第二个参数固定为数组形式， Effect会依据count的状态决定是否跳过 Effect的执行，因为count状态无变化，执行Effect将毫无意义，这类似于shouldComponentUpdate中的 state 对比或PureComponent 的自动对比。这将提升 useEffect 的性能。
```

>   **注意**
>
>   如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。参阅文档，了解更多关于[如何处理函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)以及[数组频繁变化时的措施](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)内容。
>
>   如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。
>
>   如果你传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直拥有其初始值。尽管传入 `[]` 作为第二个参数更接近大家更熟悉的 `componentDidMount` 和 `componentWillUnmount` 思维模式，但我们有[更好的](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)[方式](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)来避免过于频繁的重复调用 effect。除此之外，请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得额外操作很方便。

## React-Router

`React-Router`的难度不大,看看[文档](https://reacttraining.com/react-router/web/example/basic)就好了

## MobX 状态管理器

### @observable 可观察数据装饰器

```jsx

import {observable, computed} from 'mobx';

class Todo {
    id = Math.random()

    // 将指定属性转变为可观察属性
    @observable title = ""
    @observable finished = false
    @observable todos = []

    @computed get unfinishedTodoCount(){

        return this.todos.filter( todo => {
            !todo.finished
        }).length
        
    }
}

```

`@computed`装饰器根据函数依赖的数据变化重新计算返回值。

### 开启装饰器语法支持

```bash
npm install --save-dev babel-preset-mobx
```

.babelrc 

```json
{
  "presets": ["mobx"]
}
```

> `react`中默认`babelrc`是在`package.json` 中配置的。

### 使用inject注入store

**src/index.js**

```jsx
import store from '@/store';
import {Provider} from 'mobx-react';

ReactDOM.render(
    <Provider {...store}>
        <App />
    </Provider>
    , document.getElementById('root'));
```

 `inject`注入需要通过`Provider`顶层组件进行分发

**src/views/home/index.jsx**

```jsx
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject(['indexStore'])
@observer
class Home extends Component {

    indexStore = this.props.indexStore
```

在组件中使用`inject`注入。`@observer`是将组件转换为响应式组件

> 令人唏嘘的是，我才刚开始学习inject官方就表示，不应在未来的代码库继续使用。因为它的大多数功能都在`React.createContext`中实现了。

**官方说法：**

> Provider / inject in `mobx-react@6`已迁移到[React Context](https://reactjs.org/docs/context.html)，但可能会在将来的版本中完全删除。考虑直接[使用Context](https://mobx-react.js.org/recipes-context)。

## mobx-state-tree

根据官方说法，选择`mobx-state-tree`能更好的进行状态管理。

`npm install mobx mobx-state-tree --save`

### 创建模型实例

```jsx
import { types, onSnapshot ,getSnapshot} from "mobx-state-tree"

const Todo = types.model({
    name:'', // 默认值 （默认值同时也设定了值类型）
    done:false, 
})

const eat = Todo.create({
    name:'eat',
    //done:1, // error:创建实例的参数必须和模型定义的参数类型一致。
})

console.log(getSnapshot(eat)); // =>
// {name: "eat", done: false}
```

### types

```jsx
const Todo = types.model({
    name:'', 
    done:false, 
})

const User = types.model({
    name:''
})

const RootStore = types.model({
    users:types.map(User),
    todos:types.optional(types.map(Todo),{})
})

const store = RootStore.create()
```

> `types.optional`的第二参数为必须的，它确保你的参数默认值。
>
> 如果你希望自动生成属性，直接使用`types.*`

### 修改数据 actions

```jsx
const Todo = types
  .model({
    name: "",
    done: false
  })
  .actions(self => ({
    setName($name) {
      self.name = $name;
    },
    toggle() {
      self.done = !self.done;
      return self;
    },
    show(){
        console.log(self)
    }
  }));

const User = types.model({
  name: ""
});

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
    .actions( self => ({
        addTodo(id,name){
            self.todos.set(id,Todo.create({name}))
        }
    }))

let store = RootStore.create()

store.addTodo(1,'liu')

store.todos.get(1).toggle().show()
```

![UTOOLS1564642054275.png](http://yanxuan.nosdn.127.net/a9c35b4144735a3a71030914491ec2e1.png)

> `actions`函数传入一个接收模型本身的回调函数，该函数返回一个对象。

### getSnapshot   onSnapshot

```jsx
console.dir(getSnapshot(store)); // =>
/*
{
    users:{},
    todos:{
        1:{
            name:'liu',
            done:true,
        }
    }
}
*/

// 通过模型实例获取快照
```

**onSnapshot**

```jsx
onSnapshot(store,snapshot => {
    console.log(snapshot);
})
```

### applySnapshot

允许从快照恢复模型

```jsx
const store_te = RootStore.create(getSnapshot(store))
// 第一种方式将创建一个新的引用
applySnapshot(store,getSnapshot(store))
// 第二种方式在现有实例的基础上恢复
```

> 使用这种方式可以方便的进行状态时间旅行，只要你侦听快照并保存它，那么在你需要的时候可通过快照还原你所有的数据到 store 上

### [使用 MobX 直接操纵 Observable](https://cn.mobx.js.org/refguide/api.html#直接操控-observable)

`MST` 完全兼容 `MobX`,所以你可以使用`MobX`中的任何 api 

```jsx
import { values,keys } from 'mobx';

store.addTodo(1,'liu')
store.addTodo(2,'zhou')

console.log( keys(store.todos) ) => [1,2]
```

### observer 声明响应模组

```jsx
const TodoView = observer(props => (
	<div>
        props.todo.name
    </div>
))
```

### 计算属性 view

```jsx
const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
	.view(self => {
        get pendingCount(){
            // 仅done属性更新时会触发重新计算
            return values(self.todos).filter( todo => !todo.done).length
        }
    })
    .actions( self => ({
        addTodo(id,name){
            self.todos.set(id,Todo.create({name}))
        }
    }))
```

### 模型视图

```jsx
const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
	.view(self => {
        // 视图可在模型之外使用，也可在模型中使用
        getTodosWhereDoneIs(done){
            return values(self.todos).filter(todo => todo.done === done);
        }
    })
    .actions( self => ({
        addTodo(id,name){
            self.todos.set(id,Todo.create({name}))
        }
    }))
```

### Actions

```jsx
const todoStore = types.model('todoStore',{
      name:''
    })
    .named('X') // 克隆当前类型，但为其指定一个新名称
    .props({
      id:Math.random()
    }) // 根据当前的类型生成新类型，并添加/覆盖指定的属性
    .actions(self => ({ // 对当前类型进行操作
      setName(name){
        self.name = name
      }
    }))
    .views(self => ({
      get getName(){ // 计算函数，可以依据模型内容变化产生新的计算值
        return self.name.length > 5
      }
    }))
    .preProcessSnapshot( snapshot => {
      console.log(snapshot); // {name: "zhou"}
      return snapshot
    } )

let store = todoStore.create()

let disposer = onAction(store,(call) => {
  //  侦听在模型或其任何后代上调用的任何操作。
  //  onAction事件仅针对堆栈中最外层的被调用操作发出。
  console.log(call); // => 
  /*
  {
    args: ["fhauehfnahvh"]
    name: "setName"
    path: ""
  }
  */
})

let middleware = addMiddleware(store,(actions_call,next,abort) => {
    // 如果树是受保护的，那么任何突变都会通过你的中间件
     console.log(actions_call);
  next(...actions_call.args)
})
```

### 引用和标识符

```jsx
const Todo = types.model('Todo',{
  id:types.identifier,
  title:types.string,
})

const TodoStore = types.model({
  todos:types.array(Todo),
  selected_todo:types.reference(Todo)
})

const store = TodoStore.create({
  todos:[
    {
      id:'47', // 注意需要字符串
      title:'肺癌发'
    }
  ],
  selected_todo:'47'
})

console.log(store.selected_todo.title);// 肺癌发
// 标识符将提供对元素的快速定位
```

> 1. 每个model最多一个`identifier` 属性
> 2. 一个对象的标识符属性不可以在后面的初始化中被修改

**MST 3**中一些api发生了变化

- `t.identifier()` 至 `t.identifier`
- `t.identifier(t.number)` 至 `t.identifierNumber`
- `t.maybe()` 至 `t.maybeNull()`

#### 标识符颗粒化控制

```jsx
const Todo = types.model('Todo',{
  id:types.refinement(types.identifier,identifier => Number(identifier) > 50),
    // 限制id必须大于50否则报错
  title:types.string,
})
```

#### 自定义引用 reference

```jsx

const titleReference = types.maybeNull(types.reference(Todo,{
  get(identifier/* String */,parent /* Store */){ // 给定标识符，找到用户
    return parent.todos.find( v => identifier == v.id) || null
  },
  set(value /* Todo */){ // 给定一个用户，产生应该存储的标识符
    return value.title
  }
}))

const TodoStore = types.model({
  todos:types.array(Todo),
  selected_todo:titleReference
})

const store = TodoStore.create({
  todos:[
    {
      id:'51',
      title:'51 feafe'
    },
    {
      id:'53',
      title:"53 title"
    }
  ],
  selected_todo:53
})

console.log(store.selected_todo.title); // 53 title
```




