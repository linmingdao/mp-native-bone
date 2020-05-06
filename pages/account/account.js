import { wxNavigateTo, wxReLaunch } from "../../services/services-mixin";
import * as mineService from "../../services/handlers/mine";
import { showConfirm } from "../../services/handlers/common";
import * as SearchService from "../../services/handlers/search";
import { getUserRole } from "../../services/handlers/login";

Page({
  data: {
    role: "",
    mode: "",
    hasModeSwitch: false,
    teamName: "",
    userName: "",
    avatarUrl: ""
  },
  goTo: function(e) {
    const destination = e.currentTarget.dataset.destination;
    wxNavigateTo(`../${destination}/${destination}`);
  },
  go2MemberInfo() {
    wx.navigateTo({
      url: `../memberInfo/memberInfo?mid=${wx.getStorageSync("mid")}`
    });
  },
  gotoAudit(e) {
    const { type, status, tid } = e.currentTarget.dataset.item;
    console.log(type, status, tid);
    if (type === "team_join" && status === 0) {
      // 询问是否跳转
      const currentTid = wx.getStorageSync("tid");
      if (currentTid !== tid) {
        showConfirm("需要切换团队进行审核，立即切换?", () => {
          SearchService.switchTeam(tid).then(data => {
            wxReLaunch(
              "../index/index",
              wxNavigateTo("../groupTeamMember/groupTeamMember")
            );
          });
        });
      } else {
        wxNavigateTo(`../groupTeamMember/groupTeamMember`);
      }
    }
  },
  goToAllMessageList: function() {
    wxNavigateTo(`../allMessageList/allMessageList`);
  },
  switchMode: function() {
    const mode = !this.data.mode;
    wx.setStorageSync("role", mode ? "admin" : "member");
    this.setData({ mode });
  },
  onShow: function() {
    const team = wx.getStorageSync("team");
    const mid = wx.getStorageSync("mid");
    const tid = wx.getStorageSync("tid");
    const hasModeSwitch = wx.getStorageSync("hasModeSwitch");
    wx.setNavigationBarTitle({
      title: team.name
    });
    this.setData({
      hasModeSwitch,
      teamName: team.name
    });
    mineService
      .getMessageList({ mid, tid, start: 0, limit: 3 })
      .then(msgList => {
        this.setData({
          messageList: msgList
        });
      });
    // 获取最新的用户角色信息
    getUserRole().then(role =>
      this.setData({ role, mode: role === "admin" ? true : false })
    );
  },
  onLoad: function(options) {
    const member = wx.getStorageSync("member");
    this.setData({
      userName: member.nickname,
      avatarUrl: member.avatar_url
    });
  }
});
