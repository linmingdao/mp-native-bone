import { showConfirm } from "../../services/handlers/common";
import { showToast } from "../../services/services-mixin";
import { getUserRole } from "../../services/handlers/login";
import stateIntro from "./status/intro";
import stateOrg from "./status/org";
import stateHonor from "./status/honor";
import * as RelationService from "../../services/handlers/group/relation";

Page({
  data: {
    // 状态机
    status: {},
    unAuditMemberNum: 0,
    // 当前显示的tab: introductions,organizations,honors
    visibleTab: "introductions",
    // 简介
    expandIntroIdx: 0,
    introductions: [],
    // 组织
    expandOrgIdx: 0,
    organizations: [],
    // 荣耀
    expandHorIdx: 0,
    honors: [],
    role: "visitor",
  },
  expand(e) {
    const { visibleTab, status } = this.data;
    status[visibleTab].expand(e);
  },
  previewImage(event) {
    const src = event.currentTarget.dataset.src;
    const list = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: list,
    });
  },
  onPullDownRefresh() {
    const { status, visibleTab } = this.data;
    status[visibleTab].getColumns().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  goTo(e) {
    const destination = e.currentTarget.dataset.destination;
    let url = "";
    switch (destination) {
      case "create_team":
        url = "../groupTeamCreate/groupTeamCreate";
        break;
      case "team_member":
        if (this.data.role === "visitor") {
          showToast("成为该团队成员才能查看成员信息哟");
          return;
        }
        url = "../groupTeamMember/groupTeamMember";
        break;
      case "join_team":
        if (this.data.isSample) {
          showToast("您不能加入示例团队");
          return;
        } else if (["admin", "member"].includes(this.data.role)) {
          showToast("您已经是该团队的成员了");
          return;
        }
        url = "../groupMemberJoin/groupMemberJoin";
        break;
      case "team_manage":
        url = "../groupTeamManage/groupTeamManage";
        break;
      default:
    }
    wx.navigateTo({ url });
  },
  switchTab(e) {
    const visibleTab = e.target.dataset.name;
    if (visibleTab) {
      const status = this.data.status;
      this.setData({ visibleTab });
      if (!this.data[visibleTab].length) {
        status[visibleTab] &&
          status[visibleTab].getColumns &&
          status[visibleTab].getColumns();
      }
    }
  },
  // 添加栏目
  addColumn() {
    const { visibleTab, status } = this.data;
    status[visibleTab].addColumn();
  },
  // 删除栏目
  deleteColumn(e) {
    showConfirm("确认要删除该栏目?", () => {
      const { visibleTab, status } = this.data;
      status[visibleTab].deleteColumn(e);
    });
  },
  // 编辑栏目
  editColumn(e) {
    const { visibleTab, status } = this.data;
    status[visibleTab].editColumn(e);
  },
  // 新增item
  addItem(e) {
    const { visibleTab, status } = this.data;
    status[visibleTab].addItem(e);
  },
  // 查看item详情
  itemDetail(e) {
    const { visibleTab, status } = this.data;
    status[visibleTab].itemDetail(e);
  },
  // 编辑item
  editItem(e) {
    const { visibleTab, status } = this.data;
    status[visibleTab].editItem(e);
  },
  // 删除item
  deleteItem(e) {
    showConfirm("确认要删除么?", () => {
      const { visibleTab, status } = this.data;
      status[visibleTab].deleteItem(e);
    });
  },
  // copy: function (e) {
  //   var text = e.currentTarget.dataset.text;
  //   console.log(e);
  //   wx.setClipboardData({
  //     data: text,
  //     success: function () {
  //       wx.getClipboardData({
  //         success(res) {
  //           console.log(res.data); // data
  //         },
  //       });
  //     },
  //   });
  // },
  onShow() {
    const team = wx.getStorageSync("team");
    const tid = wx.getStorageSync("tid");
    wx.setNavigationBarTitle({ title: team.name });
    const { visibleTab, status } = this.data;
    status[visibleTab] &&
      status[visibleTab].getColumns &&
      status[visibleTab].getColumns();
    // 获取未审核的人数
    RelationService.getTeamMemberList({ tid, ownerMid: team.mid, status: 0 })
      .then((data) => this.setData({ unAuditMemberNum: data.members.length }))
      .catch((err) => console.log(err));
    // 获取最新的用户角色信息
    getUserRole().then((role) => this.setData({ role }));
  },
  onLoad({ visibleTab = "introductions" }) {
    // 初始化状态机
    this.setData({
      visibleTab,
      status: {
        introductions: stateIntro(this),
        organizations: stateOrg(this),
        honors: stateHonor(this),
      },
    });
  },
});
