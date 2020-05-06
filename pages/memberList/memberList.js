import { showConfirm } from "../../services/handlers/common";
import * as RelationService from "../../services/handlers/group/relation";

Page({
    data: {
        members: [],
        isTeamOwner: false,
        canDeleteMember: false
    },
    toggleCanDeleteMember() {
        this.setData({
            canDeleteMember: !this.data.canDeleteMember
        });
    },
    deleteMember(e) {
        showConfirm("确认要删除该成员?", () => {
            const { index, mid } = e.target.dataset;
            const tid = wx.getStorageSync("tid");
            let members = this.data.members;
            members.splice(index, 1);
            RelationService.deleteMember(tid, mid).then(() => {
                this.setData({
                    members: [...members]
                });
            });
        });
    },
    go2MemberInfo: function(e) {
        if (this.data.canDeleteMember || !e.target.dataset.mid) return;
        wx.navigateTo({
            url: `../memberInfo/memberInfo?mid=${e.target.dataset.mid}`
        });
    },
    onShow: function() {
        const tid = wx.getStorageSync("tid");
        const team = wx.getStorageSync("team");
        const isTeamOwner = wx.getStorageSync("isTeamOwner");
        this.setData({ isTeamOwner, canDeleteMember: false, ownerMid: team.mid });
        RelationService.getTeamMemberList({
            tid,
            ownerMid: this.data.ownerMid
        }).then(data => this.setData({ members: data.members }));
    }
});