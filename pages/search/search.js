import {
    deBounce
} from '../../supports/utils';
import * as SearchService from '../../services/handlers/search';
import {
    showToast,
    wxNavigateBack
} from '../../services/services-mixin';

Page({
    data: {
        filterText: '',
        searchTeamList: []
    },
    go2Result: function(e) {
        wx.navigateTo({
            url: '../result/result'
        });
    },
    bindUserInput: deBounce(function(e) {
        const contenttype = e.target.dataset.contenttype;
        const value = e.detail.value.trim();
        this.setData({
            [contenttype]: value
        });
        if (value !== '') {
            // 搜索后端
            const __this = this;
            SearchService.searchTeamList(value).then(list => {
                __this.setData({
                    searchTeamList: list
                });
            });
        }
    }, 600, false),
    cancelSearch: function() {
        this.setData({
            filterText: '',
            searchTeamList: []
        });
    },
    switchTeam: function(e) {
        let tid = e.currentTarget.dataset.tid;
        let currentTid = wx.getStorageSync('tid');
        if (tid === currentTid) {
            showToast('您正处于该团队哟');
        } else {
            SearchService.switchTeam(tid).then(data => {
                // 跳转回首页
                wx.switchTab({
                    url: '../index/index'
                });
            });
        }
    }
})