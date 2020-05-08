// 接口转换器，主要负责将小程序回调形式的接口调用转成promise形式的调用
import {
    promisify
} from './promise-customized';

const wxRequest = promisify(wx.request);
const wxNavigateTo = promisify(wx.navigateTo);
const wxRedirectTo = promisify(wx.redirectTo);
const wxNavigateBack = promisify(wx.navigateBack);
const wxSwitchTab = promisify(wx.switchTab);
const wxReLaunch = promisify(wx.reLaunch);
const wxUploadFile = promisify(wx.uploadFile);
const wxLogin = promisify(wx.login);
const wxGetUserInfo = promisify(wx.getUserInfo);
const wxShowModal = promisify(wx.showModal);

export {
    wxRequest,
    wxNavigateTo,
    wxRedirectTo,
    wxNavigateBack,
    wxSwitchTab,
    wxReLaunch,
    wxUploadFile,
    wxLogin,
    wxGetUserInfo,
    wxShowModal
};