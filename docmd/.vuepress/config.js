module.exports = {
    title: "LLORZ-O",
    description: "与君共勉",
    dest: "../temp",
    // base: '',
    head: [
        [
            "link",
            {
                rel: "icon",
                href: "/favicon.ico"
            }
        ],
        [
            "meta",
            {
                name: "viewport",
                content: "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    theme: "reco",
    themeConfig: {
        type: "blog",
        nav: [{
                text: "主页",
                link: "/",
                icon: "reco-home"
            },
            {
                text: "时间线",
                link: "/timeLine/",
                icon: "reco-date"
            },
            {
                text: "说说",
                link: "/say/",
                icon: "reco-account"
            },
            {
                text: "收藏",
                link: "/collection/",
                icon: "reco-other"
            },
            {
                text: "关于我",
                icon: "reco-message",
                items: [{
                        text: "GitHub",
                        link: "https://github.com/Mrzhoulichao",
                        icon: "reco-github"
                    },
                    {
                        text: "关于我",
                        link: "/unpack/about.html",
                        icon: "reco-account"
                    },
                    {
                        text: "备忘录",
                        link: "/unpack/memo.html",
                        icon: 'reco-document',
                    }
                    // { text: 'CSDN', link: 'https://blog.csdn.net/recoluan', icon: 'reco-csdn' },
                    // { text: '博客圆', link: 'https://www.cnblogs.com/luanhewei/', icon: 'reco-bokeyuan' },
                    // { text: 'WeChat', link: 'https://mp.weixin.qq.com/s/mXFqeUTegdvPliXknAAG_A', icon: 'reco-wechat' },
                ]
            }
        ],
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                text: "分类" // 默认 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                text: "标签" // 默认 “标签”
            }
        },
        // valine
        valineConfig: {
            appId: "9csYWHvENKpqFaCL7gssFKk3-gzGzoHsz", // your appId
            appKey: "w3k3QT2vQMEXEnAf0VzdUjzK", // your appKey
            notify: true, // 邮件提醒
            verify: true, // 评论验证
            avatar: "robohash",
            placeholder: "我膝盖中了一箭 !Orz" //
        },
        themePicker: {
            Lime: '#eaff8f',
            DaybreakBlue: '#91d5ff',
            GeekeBlue: '#adc6ff',
            GoldenPurple: "#efdbff",
            Gray: "#E1DBCD",
            Green: "#AFC8BA"
        },
        logo: "/head.jpg",
        // 博客设置
        type: "blog",
        // 关闭华为文案
        huawei: false,
        // 搜索设置
        search: true,
        searchMaxSuggestions: 10,
        // 自动形成侧边导航
        sidebar: "auto",
        // 最后更新时间
        lastUpdated: "Last Updated",
        // 作者
        author: "T9",
        // 备案号
        // record: 'xxxx',
        // 项目开始时间
        startYear: "2019",
        /**
         * 密钥 (if your blog is private)
         */

        // keyPage: {
        //   keys: ['725361'],
        //   color: '#42b983',
        //   lineColor: '#42b983'
        // },

        /**
         * valine 设置 (if you need valine comment )
         */

        // valineConfig: {
        //   appId: '...', //your appId
        //   appKey: '...', // your appKey
        // }
        serviceWorker: {
            updatePopup: true
        },
        lastUpdated: "最后一次修改于"
    },
    markdown: {
        lineNumbers: true
    },
    plugins: [
        ["@vuepress/medium-zoom", {
            selector: ".content__default p img",
            options: {
                margin: 0,
                background: 'rgba(0,0,0,.3)',
                scrollOffset: 0,
            }
        }],
        ["@vuepress-reco/vuepress-plugin-pagation"],
        "@vuepress-reco/vuepress-plugin-screenfull",
        "@vuepress-reco/vuepress-plugin-loading-page",
        ["@vuepress-reco/vuepress-plugin-kan-ban-niang", {
            theme: ["shizuku"],
            description: true,
            clean: true,
        }]
    ],
    // plugins: {
    //     "@vuepress/medium-zoom": {

    //     },
    //     "@vuepress-reco/vuepress-plugin-pagation": {},
    //     "@vuepress-reco/vuepress-plugin-screenfull": {},
    //     "@vuepress-reco/vuepress-plugin-loading-page": {
    //         perPage: 5
    //     },
    //     "@vuepress-reco/vuepress-plugin-kan-ban-niang": {
    //         theme: ["shizuku"],
    //         description: true,
    //         clean: true,
    //     }
    // },
    configureWebpack: {
        resolve: {
            alias: {
                "@img": "assets/img"
            }
        }
    }
};