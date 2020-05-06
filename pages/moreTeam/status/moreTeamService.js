import {
    Promise
} from '../../../supports/promise-customized';
import {
    showToast,
    wxReLaunch
} from '../../../services/services-mixin';
import * as SearchService from '../../../services/handlers/search';

export default function(context) {
    return {
        switchTab: function(e) {
            const relVisibleTab = e.target.dataset.name;
            context.setData({
                relVisibleTab
            });
            this.getColumns();
        },
        switchTeam: function(e) {
            let tid = e.currentTarget.dataset.tid;
            let currentTid = wx.getStorageSync('tid');
            if (tid === currentTid) {
                showToast('您正处于该团队哟');
            } else {
                SearchService.switchTeam(tid).then(data => {
                    // 跳转回首页
                    wxReLaunch('../index/index');
                });
            }
        },
        getColumns: function() {
            return new Promise((resolve, reject) => {
                const relVisibleTab = context.data.relVisibleTab;
                const tid = wx.getStorageSync('tid');
                const mid = wx.getStorageSync('mid');
                switch (relVisibleTab) {
                    case 'join':
                        SearchService.getJoinTeamList(mid).then(join => {
                            context.setData({
                                join
                            });
                            resolve();
                        });
                        break;
                    case 'concern':
                        SearchService.getConcernTeamList(mid).then(concern => {
                            context.setData({
                                concern
                            });
                            resolve();
                        });
                        break;
                    default:
                        ;
                }
            });
        },
        bindUserInput: function(e) {
            const contenttype = e.target.dataset.contenttype;
            const value = e.detail.value.trim();
            context.setData({
                [contenttype]: value
            });
            if (value !== '') {
                // 搜索后端
                SearchService.searchTeamList(value).then(list => {
                    context.setData({
                        searchTeamList: list
                    });
                });
            }
        }
    }
};