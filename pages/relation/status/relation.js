import {
    Promise
} from '../../../supports/promise-customized';
import {
    showToast,
    wxReLaunch
} from '../../../services/services-mixin';
import {
    showConfirm
} from '../../../services/handlers/common';
import * as RelationService from "../../../services/handlers/group/relation";
import * as SearchService from '../../../services/handlers/search';

export default function(context) {
    return {
        switchRelTab: function(e) {
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
        // 展开手风琴
        expand: function(e) {
            const expandIdx = parseInt(e.currentTarget.dataset.expandidx);
            context.setData({
                'expandContactIdx': context.data['expandContactIdx'] !== expandIdx ? expandIdx : -1
            });
        },
        // 获取栏目列表
        getColumns: function() {
            return new Promise((resolve, reject) => {
                const relVisibleTab = context.data.relVisibleTab;
                const tid = wx.getStorageSync('tid');
                const mid = wx.getStorageSync('mid');
                switch (relVisibleTab) {
                    case 'contact':
                        RelationService.getColumns(tid).then(data => {
                            console.log(data)
                            context.setData({
                                superior: data.superior,
                                subordinate: data.subordinate,
                                parallel: data.parallel,
                            });
                            resolve();
                        });
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
        // 接收关系请求
        acceptRelationRequest: function(e) {
            const {
                msgid,
                type,
                index
            } = e.target.dataset;
            RelationService.acceptRelationRequest(msgid).then(res => {
                this.getColumns();
            });
        },
        // 拒绝关系请求
        rejectRelationRequest: function(e) {
            showConfirm('确认要拒绝该团队的关系请求?', () => {
                const {
                    msgid,
                    type,
                    index
                } = e.currentTarget.dataset;
                RelationService.rejectRelationRequest(msgid).then(res => {
                    this.getColumns();
                });
            });
        },
        // 删除通讯录中的关系
        deleteRelation: function(e) {
            showConfirm('确认要把该团队从通讯录中删除?', () => {
                const tid = wx.getStorageSync('tid');
                const {
                    id,
                    type,
                    index
                } = e.target.dataset;
                RelationService.deleteRelation(tid, id, type).then(res => {
                    this.getColumns();
                });
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
        },
        switchTeamFromSearchResult: function(e) {
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
        }
    }
};