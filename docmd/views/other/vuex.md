---
title: vuex
date: 2019-06-27
tags:
 - VueX
 - Vue
categories:
 - Code
---

> 此篇为了记录vuex如何使用，以及使用时碰到的错误

<!-- more -->

## presetData

```js

import Vue from 'vue'
import Vuex from 'vuex'

/* Modules */
import modules_a from "./modules_a"
import modules_b from "./modules_b"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:1,
    msg:'msg'
  },
  mutations: {

  },
  actions: {

  },
  getters:{
    
  },
  modules:{
    a:modules_a,
    b:modules_b
  }
})

```

## State

### mapState

```html

<template>
  <div class="home">
    <div class="show">store__ {{count}}</div>
    <div class="show">countAlias: {{count}}</div>
    <div class="show">funcState: {{funcState}}</div>
    <br><hr>
    <div class="show">store__ {{msg}}</div>
  </div>
</template>

<script>
import {mapState,mapActions} from "vuex";

export default {
  name: "home",
  data:() => ({
    local:'本地数据'
  }),
  computed: {
    ...mapState({
      count: state => state.count,
      countAlias:'count', // 等同上一个
      funcState(state){
        return this.local + state.count
      }
    }),
    ...mapState([
      'msg'
    ])
  },
};
</script>

```

**输出**

![mapState](http://yanxuan.nosdn.127.net/9c80e5949f16cc6bc89153f58102cf10.png)

### Error

1. mapState 在使用时需要与mapActions 一起导入

## Getter

你可以把`getter`理解为 `store` 的计算属性，`getter`的返回值根据依赖被缓存，依赖改变缓存重新计算。

```js

getters:{
    msgGetter(state){
      return state.msg + count
    },
    countGetter(state,msgGetter){ // 可以传入其他的 getter 
      return state.count * 1 + msgGetter
    },
    cbGetter(state){
        return function(v){
            return state.count + v
        }
    }
  },

```

### getter的回调

```js

this.$store.getters.cbGetter('cb')

```

**注意**使用方法访问时每次都会进行计算

### mapGetter

```js

import { mapGetters } from "vuex";

computed:{
    ...mapGetters([
      'msgGetter',
      'countGetter'
    ]),
    ...mapGetters({
      cbgt:'cbGetter' // 如同之前一样，你依然可以使用别名
    })
}

```

## Mutation

vuex 中你唯一合法的修改属性是使用mutations

store.js
```js

  mutations: {
    resetCount(state,v){
      this.state.count = v
    }
  },

```

view
```html

<template>
  <div class="about">
    <div class="btn" @click="countReset">重置为0</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data:() => ({

  }),
  methods: {
    countReset(){
      this.$store.commit('resetCount',0)
    } 
  },
  computed: {
    
  },
}
</script>

```

![](http://yanxuan.nosdn.127.net/1e2f180960d0df8c3cfe7748945de2f5.png)

`mutations` 中的参数被称为 `载荷` payload 。 

### 注意

1. 当你要操作的state属性是个对象，你需要使用 `Vue.set(obj,'id',12)`的方式
2. 或直接覆盖该属性`state.obj = {...state.obj,id:12}`
3. mutation 必须是一个同步函数，因为异步将会导致无法预料的结果

### 常量命名

mutatios-type.js
```js

export const RESET_MSG = 'RESET_MSG'

```

store.js
```js

/* Mutation type */
import {RESET_MSG} from "./mutation-type"

  mutations: {
    resetCount(state,v){
      state.count = v
    },
    [RESET_MSG](state,v){
      state.msg = v
    }
  },

```

view
```html

<template>
  <div class="about">
    <div class="btn" @click="countReset">重置为0</div>
    <div class="btn" @click="msgReset">重置msg为‘留言’</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data:() => ({

  }),
  methods: {
    countReset(){
      this.$store.commit('resetCount',0)
    },msgReset(){
      this.$store.commit('RESET_MSG','留言')
    }
  },
  computed: {
    
  },
}
</script>

```

### mapMutations

```js

import { mapMutations } from 'vuex';

methods:{
    ...mapMutations({
      resct:'resetCount'
    }),
    ...mapMutations([
      'RESET_MSG'
    ])
}

```

ok 调用时只需要 `this.resct('12')` 就能进行载荷

## Action

Action被设计是用来做异步提交的，action本身并不操作state，而是提交 mutation

store.js
```js

  actions: {
    asyncChange(ctx){ 
      // ctx是一个与store实例具有相同方法和属性的上下文对象，但他并不是store。。。
      let count = 0
      let timmer = setInterval(() => {
        if(count < 10){
          ctx.commit('resetCount',count * 10)
          count ++ 
          return;
        }
        clearInterval(timmer)
      }, 1000);
    }
  },

```

1. 使用`this.$store.dispatch('asyncChange')` 就可以分发action，同样它也接受载荷
2. 使用 ctx.commit 有点麻烦，可以使用参数解构获得 ctx 上的方法与state ,**如下**

```js

actions:{
    asyncChange({commit,state},v){
        commit('resetCount')
    }
}

```

### mapActions

view
```js

import { mapActions } from 'vuex';

  methods: {
    changeAction(){
      this.asynccg()
    },
    ...mapActions({
      asynccg:'asyncChange'
    }),
    ...mapActions([
      'asyncChange'
    ])
  },

```

### 组合分发

```js

actions:{
    a({commit}){
        return new Promise(reject,resolve){
            setTimeout( () => {
                commit('push')
                resolve()
            },3000)
        }
    },
    b({commit,dispatch}){
        dispatch(a).then( () => {

        })
    },
    async c({commit,dispatch}){
        await dispatch(a)
    }
}

```

## Module

store.js
```js

// modules 的引入方式开头就已经写出来了，这里就不写第二次了

```

关于模块的[命名空间](https://vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4)

## Store 的开发

```tex

store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块

```

### 注意事项

1. 应用层级的状态应该集中到单个 store 对象中。

2. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

3. 异步逻辑都应该封装到 action 里面。

4. 严格模式在创建store时传入 `strict: true`,但是不要在生产环境使用

5. [热重载参考](https://vuex.vuejs.org/zh/guide/hot-reload.html)