---
title: 事记
date: 2022-10-14 17:20:20
---

[每日新鲜事](/2022/10/14/每日新鲜事/)



## FRP 内网穿透客户端配置

```ini
[common]
server_addr = 156.67.214.214
server_port = 7000
token = 

admin_addr = 127.0.0.1
admin_port = 7400
admin_user = admin
admin_pwd = admin

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000

[web]
type = http
local_port = 80
custom_domains = frps.llorz.online
```

## 打开终端就能使用默认的nvm node

使用`nvm install 16.15.1`创建`~/.nvmrc`

```
16.15.1
```

## 在`windows`中运行`sh`脚本

```bash
start "" "%PROGRAMFILES%\Git\bin\sh.exe" -c "sh autoBuild.sh"
```

## Linux 系统语言设置

[Debian & Ubuntu & CentOS 更改系统语言方法 – 主机指南 (hostarr.com)](https://www.hostarr.com/change-language-in-linux/)

![image-20230209160857618](index/image-20230209160857618.png)

## Hestia CP

`nginx` 配置文件模板`/usr/local/hestia/data/templates/web/nginx/`

`nginx` 创建域后的配置文件路径：`/etc/nginx/conf.d/domains`

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
