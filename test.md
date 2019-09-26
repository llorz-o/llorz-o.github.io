
# 这个文档仅供参考，正式上线后会发布正式文档

## 创建添加项目

管理员权限

![UTOOLS1569331808446.png](https://i.loli.net/2019/09/24/muyo5PwCRiJ8ekv.png)

在编辑项目中定义讨论标签，

![UTOOLS1569332933363.png](https://i.loli.net/2019/09/24/gNDtqCzeEpmx6Ij.png)

审核标签，标注审核的状态优先级

![UTOOLS1569333150597.png](https://i.loli.net/2019/09/24/NFH1fD5bk4OCPKi.png)

管理员账号在设置中创建项目

项目添加自动触发审核机制需要规范commmit的提交格式

```txt

type[
    "feat"=>新功能（feature对应需求开发的提交）,
    "fix"=>修改bug，
    "docs"=>文档改动（readme文件）,
    "style"=>代码格式（不影响代码运行，修改代码编写的样式，或是添加图片等）,
    "refactor"=>代码重构，
    "test"=>增加测试,
    "chore"=>构建工具，过程变动（webpack或是相关配置，依赖管理）
    "update"=>更新，针对我们项目更新某些东西，描述或是cdn地址等
]

subject(简短的commit描述信息)
为避免太过复杂，这里不引用标准提交规范

第二行就是 body 对本次commit 的详细描述（可选项）
详细描述需要说明本次代码变动的动机

```

示范commit如下

type需要添加cd号(如果有禅道任务，可选)

```txt
feat(cd1222) 添加主页弹窗提示

增加用户体验，构造交互友好型应用

```

添加项目的审查自动触发机制

![UTOOLS1569396414112.png](https://i.loli.net/2019/09/25/96ZoLhGCXuYzsS5.png)

项目面板

![UTOOLS1569398135728.png](https://i.loli.net/2019/09/25/JQf8F9vKk2twqbC.png)

添加用户账户分配身份与权限,对用户分组

![UTOOLS1569391355085.png](https://i.loli.net/2019/09/25/Q42EvLI1fWbsjto.png)

用户的个人简介面板

![UTOOLS1569396371876.png](https://i.loli.net/2019/09/25/Tpo4d8GtaURAz7u.png)

提交报表可以清楚的看到每个成员的commit可视化状态

![UTOOLS1569398224463.png](https://i.loli.net/2019/09/25/w9DnZlhrL5HSXR6.png)

代码审查的作用

1. 减少错误，提高代码编写规范，这样编写代码的人会自觉的将代码写的更好
2. 提高每个开发对项目的理解，一个人提交的代码，最终将产生两个审核人去熟悉代码，这样就避免了当代码作者不在或是联系不上时，有同样熟悉逻辑的开发人员可以提供帮助
3. 共同学习，查看优秀的代码可以在潜意识上提升自己的编写习惯，和思维方式，这样同一个项目的代码可以减少编码风格的差异化
4. 提高团队的学习，讨论氛围，增加团队配合度

build-br 分支产生差异化