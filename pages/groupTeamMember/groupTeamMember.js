import * as RelationService from "../../services/handlers/group/relation";
import { showConfirm } from '../../services/handlers/common';

const MAX_NUM = 19;

Page({
    data: {
        roleClassMap: {
            1: 'creator',
            2: 'admin',
            3: '',
            4: ''
        },
        isPending: false,
        rowClass: 'row_1',
        isShowMoreTeamMemberButton: false,
        teamName: '',
        mid: '',
        members: [],
        membersUnAudit: [],
        isTeamOwner: false,
        canDeleteMember: false,
        role: 'visitor'
    },
    setRowClass(total) {
        if (this.data.isTeamOwner) {
            if (total <= 4) {
                this.setData({ rowClass: 'row_1' });
            } else if (total <= 9) {
                this.setData({ rowClass: 'row_2' });
            } else if (total <= 14) {
                this.setData({ rowClass: 'row_3' });
            } else if (total <= 19) {
                this.setData({ rowClass: 'row_4' });
            }
        } else {
            if (total <= 5) {
                this.setData({ rowClass: 'row_1' });
            } else if (total <= 10) {
                this.setData({ rowClass: 'row_2' });
            } else if (total <= 15) {
                this.setData({ rowClass: 'row_3' });
            } else if (total <= 20) {
                this.setData({ rowClass: 'row_4' });
            }
        }
    },
    toggleCanDeleteMember() {
        this.setData({
            canDeleteMember: !this.data.canDeleteMember
        });
    },
    deleteMember(e) {
        showConfirm('确认要删除该成员?', () => {
            const {
                index,
                mid
            } = e.target.dataset;
            const tid = wx.getStorageSync('tid');
            let members = this.data.members;
            members.splice(index, 1);
            RelationService.deleteMember(tid, mid).then(() => {
                this.setRowClass(members.length);
                this.setData({
                    members: [...members]
                });
            });
        });
    },
    slideButtonTap(e) {
        const { index } = e.detail;
        const { mid } = e.detail.data;
        const tid = wx.getStorageSync('tid');
        if (index === 0) {
            RelationService.acceptMember(tid, mid).then(() => {
                this.setData({
                    membersUnAudit: this.data.membersUnAudit.filter(item => item.mid._id !== mid)
                });
                // 获取最新的成员列表
                RelationService.getTeamMemberList({ tid, ownerMid: this.data.ownerMid, limit: MAX_NUM }).then(data => {
                    const { members, total } = data;
                    this.setRowClass(members.length);
                    this.setData({
                        members,
                        isShowMoreTeamMemberButton: total > MAX_NUM
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        } else {
            showConfirm('确认要拒绝该成员的请求?', () => {
                RelationService.rejectsMember(tid, mid).then(() => {
                    this.setData({
                        membersUnAudit: this.data.membersUnAudit.filter(item => item.mid._id !== mid)
                    });
                });
            });
        }
    },
    moreTeamMember() {
        wx.navigateTo({ url: '../memberList/memberList' });
    },
    go2MemberInfo: function(e) {
        if (this.data.canDeleteMember || !e.target.dataset.mid) return;
        wx.navigateTo({
            url: `../memberInfo/memberInfo?mid=${e.target.dataset.mid}`
        });
    },
    quit() {
        showConfirm('确认要退出该团队么?', () => {
            const mid = wx.getStorageSync('mid');
            const tid = wx.getStorageSync('tid');
            RelationService.deleteMember(tid, mid).then(() => {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '您已经退出改团队了',
                        success: () => {
                            wx.reLaunch({ url: '../login/login' });
                        }
                    });
                })
                .catch(err => console.log(err));
        });
    },
    onShow: function() {
        const role = wx.getStorageSync('role');
        const tid = wx.getStorageSync('tid');
        const team = wx.getStorageSync('team');
        const isTeamOwner = wx.getStorageSync('isTeamOwner');
        this.setData({
            role,
            isTeamOwner,
            teamName: team.name,
            canDeleteMember: false,
            mid: team.mid,
            ownerMid: team.mid
        });
        // 获取审核通过的成员列表
        RelationService.getTeamMemberList({ tid, ownerMid: this.data.ownerMid, limit: MAX_NUM }).then(data => {
            const { members, total } = data;
            this.setRowClass(members.length);
            this.setData({
                members,
                isShowMoreTeamMemberButton: total > MAX_NUM
            });
        });
        // 获取待审核的成员列表
        if (role === 'admin') {
            RelationService.getTeamMemberList({ tid, ownerMid: this.data.ownerMid, status: 0 }).then(data => {
                const { members } = data;
                this.setData({
                    membersUnAudit: members
                });
            });
        } else {
            this.setData({
                membersUnAudit: []
            });
        }
    }
});