import {
    wxNavigateTo
} from '../../services/services-mixin.js';
import {
    showConfirm
} from '../../services/handlers/common';
import {
    DELETE_EVENT,
    DELETE_DYNAMIC
} from '../../supports/constants';
import * as indexService from '../../services/handlers/index';
import * as myPublishService from '../../services/handlers/myPublish';

function fetchData(isAppend) {
    !isAppend && wx.showNavigationBarLoading();
    const { tid, mid, type, eStart, dStart, limit, myEvents, myDynamics } = this.data;
    let start = type === 'event' ? eStart : dStart;
    myPublishService.getMyPublishList({ tid, mid, type, start, limit }).then(items => {
        !isAppend && (wx.hideNavigationBarLoading(), wx.stopPullDownRefresh());
        switch (type) {
            case 'event':
                {
                    this.setData({
                        eStart: this.data.eStart + items.length,
                        myEvents: isAppend ? [...myEvents, ...items] : items
                    });
                    break;
                }
            case 'dynamic':
                {
                    this.setData({
                        dStart: this.data.dStart + items.length,
                        myDynamics: isAppend ? [...myDynamics, ...items] : items
                    });
                    break;
                }
            default:
                ;
        }
    });
}

function onReachBottom() {
    // 获取数据
    fetchData.call(this, true);
}

function onPullDownRefresh() {
    const { type } = this.data;
    switch (type) {
        case 'event':
            this.setData({ eStart: 0 });
            break;
        case 'dynamic':
            this.setData({ dStart: 0 });
            break;
        default:
            ;
    }
    // 获取数据
    fetchData.call(this, false);
}

Page({
    data: {
        type: 'event',
        role: 'visitor',
        isShowSidebar: false,
        tid: '',
        mid: '',
        eStart: 0,
        dStart: 0,
        limit: 5,
        myEvents: [],
        myDynamics: []
    },
    showSidebar() {
        this.setData({
            isShowSidebar: true
        });
    },
    tapSidebar(e) {
        console.log(e.target)
        const { type } = e.target.dataset;
        if (type) {
            this.setData({ type });
            onPullDownRefresh.call(this);
        }
        this.setData({ isShowSidebar: false });
    },
    edit(e) {
        const { type, id } = e.target.dataset;
        wxNavigateTo(`../updateArticle/updateArticle?id=${id}&type=${type}`);
    },
    delete(e) {
        const { type, id } = e.target.dataset;
        showConfirm(type === 'event' ? DELETE_EVENT : DELETE_DYNAMIC, () => {
            indexService.deleteArticle(type, id).then(() => {
                onPullDownRefresh.call(this);
            });
        });
    },
    /**
     * 下拉刷新
     * wx.stopPullDownRefresh
     */
    onPullDownRefresh: function() {
        onPullDownRefresh.call(this);
    },
    /**
     * 上拉加载更多
     */
    onReachBottom: function() {
        onReachBottom.call(this);
    },
    onShow: function() {
        const tid = wx.getStorageSync('tid');
        const mid = wx.getStorageSync('mid');
        const role = wx.getStorageSync('role');
        this.setData({ tid, mid, role: role, type: role !== 'admin' ? 'dynamic' : 'event' });
        onPullDownRefresh.call(this);
    }
});