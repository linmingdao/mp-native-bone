import { deBounce } from "../../supports/utils";
import stateRelation from "./status/relation";
import { getUserRole } from "../../services/handlers/login";

Page({
  data: {
    lock: false,
    // 用户输入的搜索过滤条件
    filterText: "",
    searchTeamList: [],
    isShowSearcher: false,
    // 状态机
    status: {},
    // 关系显示的tab: contact, join, concern
    relVisibleTab: "contact",
    // 通讯录
    expandContactIdx: 0,
    superior: [], // 上级
    parallel: [], // 平行
    subordinate: [], // 下级
    // 加入的团队
    join: [],
    // 关注的团队
    concern: [],
    role: "visitor",
    isSample: false
  },
  touchend: function() {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({
          lock: false
        });
      }, 100);
    }
  },
  expand: function(e) {
    this.data.status["relations"].expand(e);
  },
  onPullDownRefresh: function() {
    this.data.status["relations"].getColumns().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  switchRelTab: function(e) {
    this.data.status["relations"].switchRelTab(e);
  },
  switchTeam: function(e) {
    this.data.status["relations"].switchTeam(e);
  },
  // 接收关系请求
  acceptRelationRequest: function(e) {
    this.data.status["relations"].acceptRelationRequest(e);
  },
  // 拒绝关系请求
  rejectRelationRequest: function(e) {
    //锁住
    this.setData({
      lock: true
    });
    if (this.data.role === "admin") {
      const todoaudit = e.currentTarget.dataset.todoaudit;
      if (todoaudit === 1) {
        this.data.status["relations"].rejectRelationRequest(e);
      }
    }
  },
  // 删除通讯录中的关系
  deleteRelation: function(e) {
    this.data.status["relations"].deleteRelation(e);
  },
  go2TeamSelector: function(e) {
    wx.navigateTo({
      url: `../teamSelector/teamSelector?level=${e.target.dataset.level}`
    });
  },
  bindUserInput: deBounce(
    function(e) {
      this.data.status["relations"].bindUserInput(e);
    },
    600,
    false
  ),
  cancelSearch: function() {
    this.setData({
      filterText: "",
      isShowSearcher: false,
      searchTeamList: []
    });
  },
  switchTeamFromSearchResult: function(e) {
    this.data.status["relations"].switchTeamFromSearchResult(e);
  },
  onShow: function() {
    const team = wx.getStorageSync("team");
    const member = wx.getStorageSync("member");
    const isSample = member.type === "sample";
    this.setData({ isSample });
    wx.setNavigationBarTitle({ title: team.name });
    this.data.status["relations"].getColumns();
    // 获取最新的用户角色信息
    getUserRole().then(role => this.setData({ role }));
  },
  onLoad: function() {
    this.setData({
      status: {
        relations: stateRelation(this)
      }
    });
  }
});
