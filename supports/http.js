import { Promise } from "../promise.js";
import { wxRequest } from "../wxp.js";
import { isFunction, isNotEmptyString } from "../../utils/common.js";

/**
 * 拦截的网络请求对象发起请求的前后
 * @param {object} request
 * @callback before
 * @callback  after
 * @callback  intercepter
 */
export const intercept = ({ request, before, after, intercepter }) => {
  return new Promise((resolve, reject) => {
    isFunction(before) && before();
    request
      .then((response) => {
        if (isFunction(intercepter)) {
          !intercepter({
            response,
            statusCode: response.statusCode,
          }) && resolve(response);
        } else {
          resolve(response);
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
      .finally(() => after && after());
  });
};

export default class Http {
  constructor() {
    // 是否显示loading的标志位
    this.isShowLoading = true;
    // loading的文本提示信息
    this.loadingTxt = "加载中";
    // 拦截器
    this.interceptor = null;
    // 临时的url查询参数
    this.tempQueryParams = {};
    // 全局的url查询参数
    this.globalQueryParams = {};
    // 临时的请求头信息
    this.tempHeaders = {};
    // 全局的请求头信息
    this.globalHeaders = {};
  }

  /**
   * 设置请求头
   * @param {object} headers
   * @param {boolean} isApplyToAllRequest - true: 应用于所有的请求(所以该请求头会被缓存); false: 该请求头只会被应用于接下来的一次请求
   * @param {boolean} isMixin - 在isApplyToAllRequest为true的前提下才会生效, true: 不会重置而是追加到之前缓存的全局请求头; false: 全局请求头会被置成新的请求头
   */
  headers(headers = {}, isApplyToAllRequest = false, isMixin = false) {
    if (isApplyToAllRequest) {
      this.globalHeaders = isMixin
        ? { ...this.globalHeaders, ...headers }
        : headers;
    } else {
      this.tempHeaders = headers;
    }
    return this;
  }

  /**
   * 清空单次请求的请求头配置信息
   */
  flushTempHeaders() {
    this.tempHeaders = {};
    return this;
  }

  /**
   * 设置查询参数信息
   * @param {object} query
   * @param {boolean} isApplyToAllRequest - true:应用于所有的请求(所以该请求头会被缓存);false:该请求头只会被应用于接下来的一次请求
   * @param {boolean} isMixin - 在isApplyToAllRequest为true的前提下才会生效,true:不会重置而是追加到之前缓存的全局查询参数;false:全局查询参数会被置成新的查询参数配置对象
   */
  queryParams(params = {}, isApplyToAllRequest = false, isMixin = false) {
    if (isApplyToAllRequest) {
      this.globalQueryParams = isMixin
        ? {
            ...this.globalQueryParams,
            ...params,
          }
        : params;
    } else {
      this.tempQueryParams = params;
    }
    return this;
  }

  /**
   * 清空单次请求的查询参数配置信息
   */
  flushTempQueryParams() {
    this.tempQueryParams = {};
    return this;
  }

  /**
   * 设置url信息
   * @param {string} url
   */
  url(url) {
    // TODO: 拼接查询参数信息
    this.url = url;
    return this;
  }

  /**
   * 清空单次请求的url
   */
  flushUrl() {
    this.url = "";
    return this;
  }

  /**
   * 校验逻辑
   */
  check() {
    const url = this.url;
    if (isNotEmptyString(url)) {
      console.log("url不能为空");
      return false;
    } else {
      return true;
    }
  }

  /**
   * 合并请求头对象
   */
  mergeHeaders() {
    return { ...this.globalHeaders, ...this.tempHeaders };
  }

  /**
   * 发起get请求
   * @param {object} data
   */
  get(data) {
    if (!this.check()) return;
    return intercept({
      request: wxRequest({
        data,
        url: this.url,
        method: "GET",
        header: this.mergeHeaders(),
      }),
      before: () => {
        if (this.isShowLoading) {
          wx.showLoading({ mask: false, title: this.loadingTxt });
          wx.showNavigationBarLoading();
        }
      },
      after: () => {
        if (this.isShowLoading) {
          wx.hideLoading();
          wx.hideNavigationBarLoading();
        }
      },
      intercepter: this.interceptor,
    });
  }

  /**
   * 发起post请求
   * @param {object} data
   */
  post(data) {
    if (!this.check()) return;
    return intercept({
      request: wxRequest({
        data,
        url: this.url,
        method: "GET",
        header: this.mergeHeaders(),
      }),
      before: () => {
        if (this.isShowLoading) {
          wx.showLoading({ mask: false, title: this.loadingTxt });
          wx.showNavigationBarLoading();
        }
      },
      after: () => {
        if (this.isShowLoading) {
          wx.hideLoading();
          wx.hideNavigationBarLoading();
        }
      },
      intercepter: this.interceptor,
    });
  }

  /**
   * 上传文件
   */
  upload() {}

  /**
   * 下载文件
   */
  download() {}

  /**
   * 启用拦截器
   * @callback interceptor
   */
  enableInterceptor(interceptor) {
    isFunction(interceptor) && (this.interceptor = interceptor);
    return this;
  }

  /**
   * 设置加载动画的文字信息
   * @param {string} txt
   */
  loadingText(txt) {
    this.loadingTxt = txt;
    return this;
  }

  /**
   * 启用请求开始前显示全屏loading
   */
  showLoading() {
    this.isShowLoading = true;
    return this;
  }

  /**
   * 禁用请求开始的全屏loading
   */
  hideLoading() {
    this.isShowLoading = false;
    return this;
  }
}
