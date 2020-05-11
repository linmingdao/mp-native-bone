import RequestProxy from "./requestProxy.js";

/**
 * RESTful风格的http请求客户端
 */
export default class RESTfulClient extends RequestProxy {
  constructor() {
    super();
  }

  /**
   * http-get
   * @param {object} data
   */
  get(url, data) {
    return this.executeRequest("GET", url, data);
  }

  /**
   * http-post
   * @param {object} data
   */
  post(url, data) {
    return this.executeRequest("POST", url, data);
  }

  /**
   * http-post
   * @param {object} data
   */
  options(data) {
    return this.executeRequest("OPTIONS", url, data);
  }

  /**
   * http-post
   * @param {object} data
   */
  head(data) {
    return this.executeRequest("HEAD", url, data);
  }

  /**
   * http-put
   * @param {object} data
   */
  put(data) {
    return this.executeRequest("PUT", url, data);
  }

  /**
   * http-delete
   * @param {object} data
   */
  delete(data) {
    return this.executeRequest("DELETE", url, data);
  }

  /**
   * http-trace
   * @param {object} data
   */
  trace(data) {
    return this.executeRequest("TRACE", url, data);
  }

  /**
   * http-connect
   * @param {object} data
   */
  connect(data) {
    return this.executeRequest("CONNECT", url, data);
  }

  /**
   * 上传文件
   */
  upload() {}

  /**
   * 下载文件
   */
  download() {}
}
