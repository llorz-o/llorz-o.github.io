---

---



## 服务器上的 Resilio Sync 

docker image:`nimmis/resilio-sync`

run docker image: `docker run -d -v /home/joe:/data -e RSLSYNC_USER=joe -e RSLSYNC_PASS=zlc725361 --name sync3 -p 8888:8888 -p 33333:33333 nimmis/resilio-sync`

-v 将服务器路径`/home/joe`链接到容器`/data`文件夹

-e RSLSYNC_USER 用户名

-e RSLSYNC_PASS 密码

```txt
joe
zlc725361
```

