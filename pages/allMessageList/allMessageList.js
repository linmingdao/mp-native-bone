import { wxNavigateTo, wxReLaunch } from '../../services/services-mixin';
import * as mineService from '../../services/handlers/mine';
import { showConfirm } from '../../services/handlers/common';
import * as SearchService from '../../services/handlers/search';

function fetchData(isAppend) {
    !isAppend && wx.showNavigationBarLoading();
    const { tid, mid, start, limit, messageList } = this.data;
    mineService.getMessageList({ mid, tid, start, limit }).then(items => {
        !isAppend && (wx.hideNavigationBarLoading(), wx.stopPullDownRefresh());
        this.setData({
            start: start + items.length,
            messageList: isAppend ? [...messageList, ...items] : items
        });
    });
}

function onReachBottom() {
    fetchData.call(this, true);
}

function onPullDownRefresh() {
    this.setData({ start: 0 });
    fetchData.call(this, false);
}

Page({
    data: {
        mid: '',
        tid: '',
        start: 0,
        limit: 6,
        messageList: []
    },
    gotoAudit(e) {
        const { type, status, tid } = e.currentTarget.dataset.item;
        if (type === 'team_join' && status === 0) {
            // 询问是否跳转
            const currentTid = wx.getStorageSync('tid');
            if (currentTid !== tid) {
                showConfirm('需要切换团队进行审核，立即切换?', () => {
                    SearchService.switchTeam(tid).then(data => {
                        wxReLaunch('../index/index', wxNavigateTo('../groupTeamMember/groupTeamMember'));
                    });
                });
            } else {
                wxNavigateTo(`../groupTeamMember/groupTeamMember`);
            }
        }
    },
    /**
     * 下拉刷新
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
        const mid = wx.getStorageSync('mid');
        const tid = wx.getStorageSync('mid');
        this.setData({ mid, tid });
        onPullDownRefresh.call(this);
    }
});