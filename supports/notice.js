import {
  wxShowModal,
  wxShowLoading,
  wxHideLoading,
  wxShowNavigationBarLoading,
  wxHideNavigationBarLoading,
} from "../supports/wxp.js";

// alert弹窗

export const alertError = (content) =>
  wxShowModal({ title: "错误", content, showCancel: false });

export const alertWarning = (content) =>
  wxShowModal({ title: "警告", content, showCancel: false });

export const alertInfo = (content) =>
  wxShowModal({ title: "提示", content, showCancel: false });

export const alertSuccess = (content) =>
  wxShowModal({ title: "成功", content, showCancel: false });

// confirm弹窗

export const confirmError = (content) =>
  wxShowModal({ title: "错误", content, showCancel: true });

export const confirmWarning = (content) =>
  wxShowModal({ title: "警告", content, showCancel: true });

export const confirmInfo = (content) =>
  wxShowModal({ title: "提示", content, showCancel: true });

export const confirmSuccess = (content) =>
  wxShowModal({ title: "成功", content, showCancel: true });

// loading

export const showLoading = (title = "加载中", mask = false) =>
  wxShowLoading({ title, mask });

export const hideLoading = () => wxHideLoading();

export const showNavBarLoading = () => wxShowNavigationBarLoading();

export const hideNavBarLoading = () => wxHideNavigationBarLoading();
