import { Promise } from "../promise.js";
import { mergeUrl, isFunction } from "../../utils/common.js";
import {
  wxRequest,
  wxShowLoading,
  wxHideLoading,
  wxShowNavigationBarLoading,
  wxHideNavigationBarLoading,
} from "../wxp.js";

/**
 * 判断是否是有效的HTTP事件
 * @param {String} event
 */
function isEventNameAvailable(event) {
  return ["before", "success", "error", "complete"].includes(event);
}

/**
 * 请求代理对象，主要是用于拦截请求的不同阶段
 */
export default class RequestProxy {
  constructor() {
    this.onbefore = null;
    this.onsuccess = null;
    this.onerror = null;
    this.oncomplete = null;
  }

  /**
   * 注册请求状态的事件回调函数
   * @param {string} event
   * @param {function} cb
   */
  on(event, cb) {
    if (!isEventNameAvailable(event)) return;
    isFunction(cb) && (this[`on${event}`] = cb);
    return this;
  }

  /**
   * 准备待执行的请求对象
   * @param {object} requestMetaData
   */
  prepareRequest({ url, data, method = "GET" }) {
    url = mergeUrl(url, { ...this.globalQueryParams, ...this.tempQueryParams });
    const header = { ...this.globalHeaders, ...this.tempHeaders };
    return wxRequest({ url, data, header, method });
  }

  /**
   * 执行请求
   * @param {string} method
   * @param {string} url
   * @param {string} data
   */
  executeRequest(method, url, data) {
    return new Promise((resolve, reject) => {
      // 执行请求开始的钩子函数
      isFunction(this.onbefore) && this.onbefore(this);
      // 是否显示请求前的loading动画
      this.isShowLoading &&
        wxShowLoading({ title: this.loadingTxt, mask: false });
      this.isShowNavigationBarLoading && wxShowNavigationBarLoading();
      // 执行请求
      this.prepareRequest({ method, url, data })
        .then((response) => {
          // 执行拦截器
          const { interceptFn } = this;
          let result = false;
          isFunction(interceptFn) && (result = interceptFn(response, this));
          // 拦截器拦截成功，则不会将结果上报到应用层
          if (result) return;
          // 拦截器拦截失败，则将结果上报到应用层
          resolve(response);
          // 执行请求成功的钩子函数
          isFunction(this.onsuccess) && this.onsuccess(response, this);
        })
        .catch((error) => {
          reject(error);
          // 执行请求失败的钩子函数
          isFunction(this.onerror) && this.onerror(error, this);
        })
        .finally(() => {
          // 是否隐藏请求结束的loading动画
          this.isShowLoading && wxHideLoading();
          this.isShowNavigationBarLoading && wxHideNavigationBarLoading();
          // 执行请求结束的钩子函数
          isFunction(this.oncomplete) && this.oncomplete(this);
        });
    });
  }
}
