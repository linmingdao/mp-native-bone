import * as interfaces from '../supports/interface-transformer';

// 对小程序的一些多处用到的api进行二次封装
const showToast = (msg, duration = 2000) => wx.showToast({
    title: msg,
    icon: 'none',
    duration
});
const wxNavigateTo = (url) => interfaces.wxNavigateTo({
    url
});
const wxRedirectTo = (url) => interfaces.wxRedirectTo({
    url
});
const wxNavigateBack = (url) => interfaces.wxNavigateBack({
    url
});
const wxSwitchTab = (url) => interfaces.wxSwitchTab({
    url
});
const wxReLaunch = (url, success) => interfaces.wxReLaunch({ url, success });

export {
    showToast,
    wxNavigateTo,
    wxRedirectTo,
    wxNavigateBack,
    wxSwitchTab,
    wxReLaunch
}