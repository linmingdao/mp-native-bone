import * as notice from "../supports/notice.js";
import Http from "../supports/http/http.js";
import * as MESSAGE from "../constants/message.js";
import * as STATUS_CODE from "../constants/statusCode.js";

export default new Http()
  // 配置拦截器
  .enableInterceptor((data) => {
    switch (data.code) {
      case STATUS_CODE.SUCCESS:
        // 表示不进行拦截，那么请求会到应用层
        return false;
      case STATUS_CODE.IDENTITY_EXPIRED:
        // 身份过期（需要重新登录）
        notice.alertError(MESSAGE.IDENTITY_EXPIRED);
        return true;
      case STATUS_CODE.NO_PERMISSION:
        // 无权限访问
        notice.alertError(MESSAGE.NO_PERMISSION);
        return true;
      default:
        // 其余状态码一律进行拦截
        notice.alertError(response.message || "未知的服务端错误");
        return true;
    }
  })
  // 配置请求开始的回调函数
  .on("before", (client) => {
    const cookie = wx.getStorageSync("cookie") || "";
    client.headers({ cookie, "Content-Type": "application/json" }, true, true);
  })
  // 配置请求错误的回调函数
  .on("error", (error) => {
    notice.alertError(JSON.stringify(error));
  })
  // 配置请求结束之后的回调函数
  .on("complete", (client) => {
    client.hideLoading();
    client.showNavBarLoading();
  });
