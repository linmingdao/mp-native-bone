// 接口转换器，主要负责将小程序回调形式的接口调用转成promise形式的调用
import { promisify } from "./promise.js";

const wxLogin = promisify(wx.login);
const wxRequest = promisify(wx.request);
const wxReLaunch = promisify(wx.reLaunch);
const wxShowModal = promisify(wx.showModal);
const wxSwitchTab = promisify(wx.switchTab);
const wxNavigateTo = promisify(wx.navigateTo);
const wxRedirectTo = promisify(wx.redirectTo);
const wxUploadFile = promisify(wx.uploadFile);
const wxGetUserInfo = promisify(wx.getUserInfo);
const wxNavigateBack = promisify(wx.navigateBack);
const wxShowLoading = promisify(wx.showLoading);
const wxHideLoading = promisify(wx.hideLoading);
const wxShowNavigationBarLoading = promisify(wx.showNavigationBarLoading);
const wxHideNavigationBarLoading = promisify(wx.hideNavigationBarLoading);

export {
  wxLogin,
  wxRequest,
  wxReLaunch,
  wxShowModal,
  wxSwitchTab,
  wxNavigateTo,
  wxRedirectTo,
  wxUploadFile,
  wxGetUserInfo,
  wxNavigateBack,
  wxShowLoading,
  wxHideLoading,
  wxShowNavigationBarLoading,
  wxHideNavigationBarLoading,
};
