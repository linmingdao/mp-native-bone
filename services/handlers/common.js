import { Promise } from "../../supports/promise-customized";
import { wxUploadFile } from "../../supports/interface-transformer";
import { intercept } from "../../supports/interceptor";
import * as API from "../api";
import * as Http from "../../supports/http";

export const getHost = () => API.HOST;

/**
 * 提交表单数据
 * @param {String} url
 * @param {Object} formData
 */
export const submitFormData = (url, formData, headers = {}) => {
  return Http.postWithHeaders({
    url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...headers
    },
    data: formData
  });
};

/**
 * 上传单个文件到指定url
 * @param {String} url
 * @param {String} name
 * @param {String} filePath
 * @param {Object} formData
 */
export const uploadFile = (
  url,
  name,
  filePath,
  formData,
  enableLoading = true,
  loadingMsg = ""
) => {
  const cookie = wx.getStorageSync("cookie") || "";
  return intercept(
    wxUploadFile({
      url,
      name,
      filePath,
      formData,
      header: {
        cookie
      }
    }),
    () => {
      enableLoading &&
        wx.showLoading({
          mask: true,
          title: loadingMsg
        });
      // enableLoading && wx.showNavigationBarLoading();
    },
    () => {
      enableLoading && wx.hideLoading();
      // enableLoading && wx.hideNavigationBarLoading();
    }
  );
};

/**
 * 批量上传文件到指定url
 * @param {String} url
 * @param {Array} files
 * @param {String} id
 */
export const uploadFiles = (
  url = "",
  files = [],
  id,
  enableLoading = true,
  loadingMsg = ""
) => {
  // 生成并发的请求列表
  const dfdList = files.map(file => {
    return uploadFile(
      url,
      file.name,
      file.path,
      {
        id,
        fieldname: file.name,
        type: file.type
      },
      false
    );
  });

  // 使用拦截器执行并拦截请求
  return intercept(
    Promise.all(dfdList),
    () => {
      enableLoading &&
        wx.showLoading({
          mask: true,
          title: loadingMsg
        });
      // enableLoading && wx.showNavigationBarLoading();
    },
    () => {
      enableLoading && wx.hideLoading();
      // enableLoading && wx.hideNavigationBarLoading();
    }
  );
};

/**
 * 显示确认弹窗
 * @param {*} confirm
 * @param {*} cancel
 */
export const showConfirm = (msg = "确认删除么?", confirm, cancel) => {
  wx.showModal({
    title: "提示",
    content: msg,
    showCancel: true,
    cancelText: "取消",
    cancelColor: "#929292",
    confirmColor: "#eb1a1a",
    success(res) {
      if (res.confirm) {
        typeof confirm === "function" && confirm();
      } else if (res.cancel) {
        typeof cancel === "function" && cancel();
      }
    }
  });
};

/**
 * 持久化用户信息
 * @param {*} data
 */
export const persistUserInfo = ({ data }) => {
  const member = data["member"];
  const team = member["team"];
  wx.setStorageSync("member", member);
  wx.setStorageSync("team", team);
  wx.setStorageSync("tid", team["_id"]);
  wx.setStorageSync("mid", member._id);
  wx.setStorageSync("isTeamOwner", member._id === team.mid);
  wx.setStorageSync("role", data["role"]); // admin,visitor,member
  wx.setStorageSync("hasModeSwitch", data["role"] === "admin");

  return member._id;
};
