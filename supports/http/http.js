// Http请求公共能力
import { wxRequest } from "./interface-transformer";
import { intercept } from "../supports/interceptor";
import { wxReLaunch } from "../services/services-mixin.js";

// 默认的拦截器
const defaultIntercepter = ({ statusCode }) => {
  if (statusCode === 401) {
    // 未登录或者登录过期，需要跳转到登录页面
    wx.showModal({
      title: "提示",
      showCancel: false,
      content: "登录信息已过期，请重新登录",
      success: () => wxReLaunch("/pages/login/login")
    });
    return true;
  }
  return false;
};

/**
 * GET_带请求头
 * @param url
 * @param headers
 * @param data
 */
const getWithHeaders = ({
  url = "",
  headers = {},
  data = {},
  enableLoading = true,
  loadingMsg = "加载中",
  intercepter = defaultIntercepter
}) => {
  const cookie = wx.getStorageSync("cookie") || "";
  return intercept(
    wxRequest({
      url,
      method: "GET",
      data: data,
      header: { cookie, "Content-Type": "application/json", ...headers }
    }),
    () => {
      enableLoading && wx.showLoading({ mask: true, title: loadingMsg });
      wx.showNavigationBarLoading();
    },
    () => {
      enableLoading && wx.hideLoading();
      wx.hideNavigationBarLoading();
    },
    intercepter
  );
};

/**
 * GET_不带请求头
 * @param url
 * @param data
 */
const get = ({
  url = "",
  data = {},
  enableLoading = true,
  loadingMsg = "加载中",
  intercepter = defaultIntercepter
}) => {
  return getWithHeaders({
    url,
    headers: { "Content-Type": "application/json" },
    data,
    enableLoading,
    loadingMsg,
    intercepter
  });
};

/**
 * POST_带请求头
 * @param url
 * @param headers
 * @param data
 */
const postWithHeaders = ({
  url,
  headers = {},
  data = {},
  enableLoading = true,
  loadingMsg = "加载中",
  intercepter = defaultIntercepter
}) => {
  const cookie = wx.getStorageSync("cookie") || "";
  return intercept(
    wxRequest({
      url,
      method: "POST",
      data: data,
      header: { cookie, "Content-Type": "application/json", ...headers }
    }),
    () => {
      enableLoading && wx.showLoading({ mask: true, title: loadingMsg });
      wx.showNavigationBarLoading();
    },
    () => {
      enableLoading && wx.hideLoading();
      wx.hideNavigationBarLoading();
    },
    intercepter
  );
};

/**
 * POST_不带请求头
 * @param url
 * @param data
 */
const post = ({
  url,
  data = {},
  enableLoading = true,
  loadingMsg = "",
  intercepter = defaultIntercepter
}) => {
  return postWithHeaders({
    url,
    headers: { "Content-Type": "application/json" },
    data,
    enableLoading,
    loadingMsg,
    intercepter
  });
};

export { get, getWithHeaders, post, postWithHeaders };
