---
title: 事记
date: 2022-10-14 17:20:20
---

[每日新鲜事](/2022/10/14/每日新鲜事/)

## Linux FTP 上传解压BUG

> 从`Windows`上传`zip`文件到`Linux`时需要修改传输模式为`binary`,具体切换如下
>
> ```bash
> ftp> bin
> 200 TYPE is now 8-bit binary # 出现下面这行就是 binary 传输模式
> ```
>
> 如果不进行切换的话将无法成功`unzip`传输的文件

## 脚本使用

```bash
hexo new post title # 创建一篇文章
hexo new page page_title # 创建一个页面
```

> 创建页面需要修改`themes\pure\_config.yml`中的`menu,menu_icons`字段
>
> 添加语言文件`themes\pure\languages\zh-CN.yml`中的`menu`的翻译
>
> icon 图标见 [Icon Font (cofess.com)](http://blog.cofess.com/hexo-theme-pure/iconfont/demo_fontclass.html)
