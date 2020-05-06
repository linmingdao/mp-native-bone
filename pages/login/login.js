import { login } from "../../services/handlers/login";

// 获取应用实例
const app = getApp();

Page({
    data: {
        isShowLoginAuthorizationDialog: false,
        userInfo: undefined,
        hasUserInfo: false,
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        groups: [{
                name: "team-info",
                label: "团队资讯",
                items: [{
                        iconClass: "event",
                        desc: "查看团队内部要事信息"
                    },
                    {
                        iconClass: "dynamic",
                        desc: "查看团队成员日常动态"
                    },
                    {
                        iconClass: "pub-dynamic",
                        desc: "发布要事、动态"
                    }
                ]
            },
            {
                name: "team-mgr",
                label: "团队管理",
                items: [{
                        iconClass: "create-team",
                        desc: "创建团队"
                    },
                    {
                        iconClass: "join-team",
                        desc: "加入团队"
                    },
                    {
                        iconClass: "team-intro",
                        desc: "查看团队简介内容"
                    },
                    {
                        iconClass: "team-honor",
                        desc: "查看团队荣誉信息"
                    },
                    {
                        iconClass: "team-org",
                        desc: "查看团队组织信息"
                    }
                ]
            },
            {
                name: "team-rel",
                label: "团队关系",
                items: [{
                        iconClass: "team-relation",
                        desc: "查看团队关系"
                    },
                    {
                        iconClass: "my-joined-team",
                        desc: "我加入的团队"
                    },
                    {
                        iconClass: "my-concerned-team",
                        desc: "我关注的团队"
                    }
                ]
            }
        ]
    },
    requestLoginAuthorization() {
        this.setData({
            isShowLoginAuthorizationDialog: true
        });
    },
    bindUserFocus() {
        this.setData({
            isShowLoginAuthorizationDialog: true
        });
    },
    cancel() {
        this.setData({
            isShowLoginAuthorizationDialog: false
        });
    },
    onLoad: function(options) {
        let redirectUrl;
        let switchToTab = "true";
        if (options.redirect) {
            redirectUrl = decodeURIComponent(options.redirect);
            switchToTab = options.switchToTab;
        }

        console.log("options");
        console.log(options);
        // 收集分享的团队信息
        let shardTeamInfo = undefined;

        console.log("options");
        console.log(options);

        if (options.scene) {
            // 二维码
            console.log("has scene");
            const scene = decodeURIComponent(options.scene);
            shardTeamInfo = { _id: scene };
        } else if (options.tid) {
            // 转发
            shardTeamInfo = { _id: options.tid };
        }
        if (app.globalData.userInfo) {
            this.setData({ hasUserInfo: true });
            const { iv, encryptedData, userInfo } = app.globalData;
            doLoging({
                iv,
                encryptedData,
                userInfo,
                shardTeamInfo,
                redirect: redirectUrl,
                switchToTab
            });
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                const { iv, encryptedData, userInfo } = res;
                app.globalData.iv = iv;
                app.globalData.userInfo = userInfo;
                app.globalData.encryptedData = encryptedData;
                this.setData({ hasUserInfo: true });
                doLoging({
                    iv,
                    encryptedData,
                    userInfo,
                    shardTeamInfo,
                    redirect: redirectUrl,
                    switchToTab
                });
            };
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    const { iv, encryptedData, userInfo } = res;
                    app.globalData.iv = iv;
                    app.globalData.userInfo = userInfo;
                    app.globalData.encryptedData = encryptedData;
                    this.setData({ hasUserInfo: true });
                    doLoging({
                        iv,
                        encryptedData,
                        userInfo,
                        shardTeamInfo,
                        redirect: redirectUrl,
                        switchToTab
                    });
                }
            });
        }
    },
    getUserInfo: function(e) {
        this.setData({ isShowLoginAuthorizationDialog: false });
        const { iv, encryptedData, userInfo } = e.detail;
        if (userInfo) {
            app.globalData.iv = iv;
            app.globalData.userInfo = userInfo;
            app.globalData.encryptedData = encryptedData;
            this.setData({ hasUserInfo: true });
            doLoging({ iv, encryptedData, userInfo });
        }
    }
});

function doLoging({
    iv,
    userInfo,
    encryptedData,
    shardTeamInfo,
    switchToTab = "true",
    redirect = "/pages/index/index"
}) {
    // 执行登录流程
    login({ userInfo, iv, encryptedData, shardTeamInfo })
        .then(() => {
            switchToTab === "true" ?
                wx.switchTab({ url: redirect }) :
                wx.navigateTo({ url: redirect });
        })
        .catch(err => {
            wx.showToast({ title: "登录流程异常", icon: "none" });
            console.error(err);
        });
}