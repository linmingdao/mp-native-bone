import * as API from "../api";
import * as CommonService from "./common";
import * as Http from "../../supports/http";
import { Promise } from "../../supports/promise-customized";

const uploadFile = (file, id, type) => {
  return new Promise((resolve, reject) => {
    CommonService.uploadFile(API.UPLOAD_PHOTO, file.name, file.path, {
      id,
      type
    }).then(data => {
      resolve(data);
    });
  });
};

const uploadFiles = (files, id, type) => {
  const dfdList = files.map(file => uploadFile(file, id, type));
  return Promise.all(dfdList);
};

const API_MAP = {
  event: API.CREATE_EVENT,
  dynamic: API.CREATE_DYNAMIC,
  updateEvent: API.UPDATE_EVENT,
  updateDynamic: API.UPDATE_DYNAMIC
};

// 创建动态
export const createArticle = (tid, mid, title, content, files, type) => {
  return new Promise((resolve, reject) => {
    // 创建动态
    Http.post({ url: API_MAP[type], data: { tid, mid, title, content } })
      .then(data => {
        const id = data.data[type]["_id"];
        // 上传图片
        uploadFiles(files, id, type)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            wx.showToast({ title: "图片上传失败" });
            resolve(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

/**
 * 更新动态
 * @param {*} type
 * @param {*} id
 * @param {*} title
 * @param {*} content
 * @param {*} figures
 * @param {*} figuresBuf
 */
export const updateArticle = (
  type = "updateDynamic",
  id,
  title,
  content = "",
  figures = [],
  figuresBuf = []
) => {
  const url = API_MAP[type];
  const apiType = type === "updateDynamic" ? "dynamic" : "event";

  // 更新要事动态的文本信息
  const dfdList = [Http.post({ url, data: { id, title, content } })];
  // 更新用户删除掉的后端图片
  figuresBuf.length &&
    dfdList.push(
      Http.post({
        url: API.DELETE_EVENT_DYNAMIC_IMAGE,
        data: { id, type: apiType, urls: figuresBuf }
      })
    );
  // 更新用户新上传的本地图片
  figures.length &&
    dfdList.push(
      uploadFiles(
        figures.filter(item => item.from !== "api"),
        id,
        apiType
      )
    );

  return Promise.all(dfdList);
};
