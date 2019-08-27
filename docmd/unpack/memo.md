---
title: 干货
---

## pLUGIN-cSCODE

1. Live Share vscode官方推出的代码共享协作插件
2. gitlens 编辑代码时可以看到git的改动记录
3. Live Server html热更新实时预览
4. Quokka.js 编写可实时查看运行结果的js代码
5. Todo Tree todo注释树,支持自定义标签

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

6. Bookmarks 代码书签
7. Debugger for Chrome 在Chrome上调试代码
8. Vetur Vue的语法插件
9.  Prettier 代码格式美化
10. Git History github的提交历史
11. auto close tag 标签闭合
12. auto rename tag 标签同步更名
13. Better Comments 注释颜色
14. Turbo Console Log 快速生成 console 
15. Polacode 生成代码截图
16. vscode-faker 快速生成想要的数据
17. Path Intellisense 路径补足
18. Power mode 编辑代码时提供特效

## theme or icon

1. Material icon theme
2. Noctis
3. Night Owl
4. Beautiful UI
5. Outrun
