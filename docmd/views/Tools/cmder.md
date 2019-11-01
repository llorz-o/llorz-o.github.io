---
title: Cmder配置
date: 2019-09-06
categories:
  - Tools
tags:
  - Tool
  - Cmder
---

我用的是 Mini 版的`Cmder`,所以直接下载解压缩就行了.
非常好用~

<!-- more -->

将解压路径添加新的系统变量`CMDER_HOME`

![UTOOLS1567751303820.png](https://user-gold-cdn.xitu.io/2019/9/6/16d05427a83223ae?w=660&h=180&f=png&s=10437)

再在系统变量`Path`中添加`%CMDER_HOME%`

![UTOOLS1567751544423.png](https://user-gold-cdn.xitu.io/2019/9/6/16d05462a46a0d95?w=396&h=89&f=png&s=3138)

## 将 Cmder 添加到右键

```bash

Cmder.exe /REGISTER ALL

```

然后你就可以在右键中看到`Cmder Here`了

**Cmder 常用快捷键 :**

利用 Tab，自动路径补全；
利用 Ctrl+T 建立新页签；利用 Ctrl+W 关闭页签;
利用 Ctrl+Tab 切换页签;
Alt+F4：关闭所有页签
Alt+Shift+1：开启 cmd.exe
Alt+Shift+2：开启 powershell.exe
Alt+Shift+3：开启 powershell.exe (系统管理员权限)
Ctrl+1：快速切换到第 1 个页签
Ctrl+n：快速切换到第 n 个页签( n 值无上限)
Alt + enter： 切换到全屏状态；
Ctr+r 历史命令搜索
