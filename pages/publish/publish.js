import { getUserRole } from "../../services/handlers/login";

Page({
  data: {
    role: "visitor"
  },
  go2MyPublish() {
    wx.navigateTo({ url: "../myPublish/myPublish" });
  },
  go2NewPage: function(e) {
    var page = e.currentTarget.dataset.name;
    if (page) {
      let url = `../${page}/${page}`;
      if ((page = "publishAffairs")) {
        url += `?type=${e.currentTarget.dataset.type}`;
      }
      wx.navigateTo({ url });
    }
  },
  onShow: function() {
    // 获取最新的用户角色信息
    getUserRole().then(role => this.setData({ role }));
  }
});
