import {
    showToast,
    wxNavigateBack
} from '../../services/services-mixin';
import * as permissionService from "../../services/handlers/permission";

Page({
    data: {
        members: []
    },
    checkTeam: function(e) {
        const { type, index } = e.currentTarget.dataset;
        if (this.data[type][index].isAdmin) {
            this.data[type][index].isAdmin = false
        } else {
            this.data[type][index].isAdmin = true
        }
        this.setData({
            [type]: [...this.data[type]]
        });
    },
    commit: function(e) {
        const tid = wx.getStorageSync('tid');
        permissionService.setMemberToAdmin({ tid, mids: this.data.members.filter(item => item.isAdmin).map(item => item._id) }).then(res => {
            wxNavigateBack();
        });
    },
    onShow: function() {
        const tid = wx.getStorageSync('tid');
        const team = wx.getStorageSync('team');
        permissionService.getPermissionMemberList({ tid, ownerMid: team.mid }).then(members => {
            this.setData({
                members
            });
        });
    }
})