import RESTfulClient from "./restfulClient";
import { isFunction } from "../../utils/common.js";

export default class Http extends RESTfulClient {
  constructor() {
    super();
    // 是否显示导航栏loading的标志位
    this.isShowNavigationBarLoading = true;
    // 是否显示loading的标志位
    this.isShowLoading = false;
    // loading的文本提示信息
    this.loadingTxt = "加载中";
    // 拦截器
    this.interceptFn = null;
    // 临时的请求头信息
    this.tempHeaders = {};
    // 全局的请求头信息
    this.globalHeaders = {};
    // 临时的url查询参数
    this.tempQueryParams = {};
    // 全局的url查询参数
    this.globalQueryParams = {};
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
   * 清空临时缓存
   */
  clear() {
    this.tempHeaders = {};
    this.tempQueryParams = {};
    return this;
  }

  /**
   * 启用拦截器
   * @callback cb
   */
  enableInterceptor(cb) {
    isFunction(cb) && (this.interceptFn = cb);
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

  /**
   * 启用请求开始前的导航栏loading
   */
  showNavigationBarLoading() {
    this.isShowNavigationBarLoading = true;
    return this;
  }

  /**
   * 禁用请求开始的导航栏loading
   */
  hideNavigationBarLoading() {
    this.isShowNavigationBarLoading = false;
    return this;
  }
}
