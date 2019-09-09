---
title: 干货
---

## pLUGIN-cSCODE

1. Live Share vscode官方推出的代码共享协作插件:top:
2. gitlens 编辑代码时可以看到git的改动记录
3. Live Server html热更新实时预览
4. Quokka.js 编写可实时查看运行结果的js代码:fire:
5. Project Manager 将项目添加到收藏夹:+1:
6. Todo Tree todo注释树,支持自定义标签

在用户设置中添加如下配置

```json

	"todo-tree.tags": [
        "todo",
        "fixme",
        "tag",
        "done",
        "note"
    ], 
    "todo-tree.regexCaseSensitive": false,
    "todo-tree.showInExplorer": true,
    "todo-tree.defaultHighlight": {
        "foreground": "white",
        "background": "yellow",
        "icon": "check",
        "rulerColour": "yellow",
        "type": "tag",
        "iconColour": "yellow"
    },
    "todo-tree.customHighlight": {
        "todo": {
            "background": "yellow",
            "rulerColour": "yellow",
            "iconColour": "yellow"
        },
        "fixme": {
            "background": "red",
            "icon": "beaker",
            "rulerColour": "red",
            "iconColour": "red",
        },
        "tag": {
            "background": "blue",
            "icon": "tag",
            "rulerColour": "blue",
            "iconColour": "blue",
            "rulerLane": "full"
        },
        "done": {
            "background": "green",
            "icon": "issue-closed",
            "rulerColour": "green",
            "iconColour": "green",
        },
        "note": {
            "background": "#f90",
            "icon": "note",
            "rulerColour": "#f90",
            "iconColour ": "#f90"
        }
    }

```

7. Bookmarks 代码书签
8. Debugger for Chrome 在Chrome上调试代码
9. Vetur Vue的语法插件
10.  Prettier 代码格式美化
11. Git History github的提交历史
12. auto close tag 标签闭合
13. auto rename tag 标签同步更名
14. Better Comments 注释颜色
15. Turbo Console Log 快速生成 console 
16. Polacode 生成代码截图
17. vscode-faker 快速生成想要的数据
18. Path Intellisense 路径补足
19. Power mode 编辑代码时提供特效
20. Code Run 

## theme or icon

1. Material icon theme
2. Noctis
3. Night Owl
4. Beautiful UI
5. Outrun
