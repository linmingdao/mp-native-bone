import { showToast, wxNavigateTo } from "../../services/services-mixin.js";
import { getHost } from "../../services/handlers/common";
import * as indexService from "../../services/handlers/index";
import * as commentService from "../../services/handlers/comment";
import * as WxParse from "../../components/wxParse/wxParse.js";
import { wxReLaunch } from "../../services/services-mixin.js";

Page({
    data: {
        status: -1,
        id: "",
        type: "",
        title: "",
        photo: [],
        date: "",
        view: 0,
        role: "visitor",
        start: 0,
        limit: 5,
        isShowCommentsDialog: false,
        currentComments: "",
        commentsList: []
    },
    onShareAppMessage: function() {
        const { id, type } = this.data;
        const team = wx.getStorageSync("team");
        return {
            title: team.name,
            path: `/pages/details/details?id=${id}&type=${type}`,
            success: function(res) {},
            fail: function(res) {}
        };
    },
    /**
     * 转发
     * @param {*} e
     */
    forward: function() {
        wxNavigateTo(
            `../forwardTeamSelector/forwardTeamSelector?id=${this.data.id}&type=${this.data.type}`
        );
    },
    handleInputComments(e) {
        this.setData({ currentComments: e.detail.value });
    },
    showCommentsDialog() {
        this.setData({ isShowCommentsDialog: true });
    },
    hideCommentsDialog() {
        this.setData({ isShowCommentsDialog: false });
    },
    doComment() {
        const { id, type, currentComments } = this.data;
        if (currentComments.trim() !== "") {
            const tid = wx.getStorageSync("tid");
            const mid = wx.getStorageSync("mid");
            commentService
                .comment({ tid, id, type, mid, content: currentComments.trim() })
                .then(() => {
                    this.setData({ currentComments: "" });
                    this.data.commentsList.length < this.data.limit &&
                        doPullDownRefresh(this);
                    this.hideCommentsDialog();
                });
        } else {
            showToast("留言内容不能为空");
        }
    },
    deleteComment(event) {
        const tid = wx.getStorageSync('tid');
        const id = event.currentTarget.dataset.id;
        wx.showModal({
            title: "提示",
            content: "确定要删除该留言?",
            success: (res) => {
                if (res.cancel) return;
                console.log(id);
                console.log(this.data.commentsList);
                commentService.deleteComment({ tid, id }).then(() => {
                    this.setData({
                        commentsList: [...this.data.commentsList.filter(item => item._id !== id)]
                    });
                    showToast('成功删除留言');
                });
            }
        });
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        doPullDownRefresh(this);
    },
    /**
     * 上拉加载更多
     */
    onReachBottom() {
        this.setData({ start: this.data.start + this.data.limit });
        const { id, start, limit } = this.data;
        const tid = wx.getStorageSync("tid");
        commentService.getComments({ tid, id, start, limit }).then(commentsList => {
            this.setData({
                start: commentsList.length === limit ?
                    start : start - limit + commentsList.length,
                commentsList: [...this.data.commentsList, ...commentsList]
            });
        });
    },
    /**
     * 预览图片
     * @param {*} event
     */
    previewImage: function(event) {
        const src = event.currentTarget.dataset.src;
        const list = event.currentTarget.dataset.list;
        wx.previewImage({ current: src, urls: list });
    },
    onShow: function() {
        this.setData({ role: wx.getStorageSync("role") });
    },
    onLoad: function(options) {
        console.log(options);
        this.setData({ id: options.id, type: options.type });
        switch (options.type) {
            case "hot":
                wx.setNavigationBarTitle({ title: "推荐详情" });
                break;
            case "event":
                wx.setNavigationBarTitle({ title: "要事详情" });
                break;
            case "dynamic":
                wx.setNavigationBarTitle({ title: "动态详情" });
                break;
            default:
        }
        indexService
            .getDetails({
                ...options,
                intercepter: ({ statusCode }) => {
                    if (statusCode === 401) {
                        // 未登录或者登录过期，需要跳转到登录页面再跳转回来
                        wx.showModal({
                            title: "提示",
                            showCancel: false,
                            content: "登录信息已过期，请先登录",
                            success: res => {
                                if (res.confirm) {
                                    const redirectUrl = encodeURIComponent(
                                        `/pages/details/details?id=${options.id}&type=${options.type}`
                                    );
                                    wxReLaunch(
                                        `/pages/login/login?redirect=${redirectUrl}&switchToTab=false`
                                    );
                                }
                            }
                        });
                        return true;
                    } else {
                        doPullDownRefresh(this);
                    }
                    return false;
                }
            })
            .then(data => {
                this.setData({
                    status: data.status,
                    title: data.title,
                    photo: data.photo.map(item => `${getHost()}/${item}`),
                    date: data.date,
                    view: data.view,
                    source: data.source
                });
                // 处理富文本
                WxParse.wxParse(
                    "detailsContent",
                    "html",
                    data.content.replace(/\n/g, "<br />"),
                    this,
                    5
                );
            });
    }
});

function doPullDownRefresh(ctx) {
    ctx.setData({ start: 0 });
    const { id, start, limit } = ctx.data;
    const tid = wx.getStorageSync("tid");
    commentService
        .getComments({ tid, id, start, limit })
        .then(commentsList => ctx.setData({ commentsList }));
}