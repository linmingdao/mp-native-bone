import { wxNavigateBack } from "../../services/services-mixin.js";
import * as groupService from "../../services/handlers/group/group";

Page({
  data: {
    isPending: false,
    auths: {
      event: 1,
      dynamic: 1,
      honor: 1,
      intro: 1,
      structure: 1,
      contact: 1
    }
  },
  setAuth(e) {
    const { auth, type } = e.target.dataset;
    this.setData({
      auths: { ...this.data.auths, [type]: Number(auth) }
    });
  },
  updateAuths() {
    const { auths } = this.data;
    const tid = wx.getStorageSync("tid");
    const mid = wx.getStorageSync("mid");
    this.setData({ isPending: true });
    groupService
      .updateColumnAuthInfo(mid, tid, auths)
      .then(() => {
        wx.showToast({ title: "成功更新设置" });
        wxNavigateBack();
      })
      .catch(err => console.error(err))
      .finally(() => this.setData({ isPending: false }));
  },
  onShow() {
    const tid = wx.getStorageSync("tid");
    const mid = wx.getStorageSync("mid");
    groupService.getColumnAuthInfo(mid, tid).then(auths => {
      this.setData({ auths: { ...this.data.auths, ...auths } }).catch(err =>
        console.error(err)
      );
    });
  }
});
