// 接口转换器，主要负责将小程序回调形式的接口调用转成promise形式的调用
import { promisify } from "./promise.js";

export default {
  wxLogin: promisify(wx.login),
  wxRequest: promisify(wx.request),
  wxReLaunch: promisify(wx.reLaunch),
  wxShowModal: promisify(wx.showModal),
  wxSwitchTab: promisify(wx.switchTab),
  wxNavigateTo: promisify(wx.navigateTo),
  wxRedirectTo: promisify(wx.redirectTo),
  wxUploadFile: promisify(wx.uploadFile),
  wxGetUserInfo: promisify(wx.getUserInfo),
  wxNavigateBack: promisify(wx.navigateBack),
  wxShowLoading: promisify(wx.showLoading),
  wxHideLoading: promisify(wx.hideLoading),
  wxShowNavigationBarLoading: promisify(wx.showNavigationBarLoading),
  wxHideNavigationBarLoading: promisify(wx.hideNavigationBarLoading),
};
