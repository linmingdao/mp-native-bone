import { Promise } from "../../../supports/promise-customized";
import * as API from "../../api";
import * as Http from "../../../supports/http";
import * as CommonService from "../common";

// 新增栏目
export const addColumn = (tid, title = "", content = "") => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.CREATE_INTRO,
      data: { tid, title, content }
    }).then(res => {
      resolve(res);
    });
  });
};

// 删除栏目
export const deleteColumn = id => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.DELETE_INTRO, data: { id } }).then(res => {
      resolve(res);
    });
  });
};

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

// 更新栏目
export const updateColumn = (
  id,
  title = "",
  content = "",
  figures = [],
  figuresBuf = []
) => {
  // 更新文本信息
  const dfdList = [
    Http.post({ url: API.UPDATE_INTRO, data: { _id: id, title, content } })
  ];
  // 更新用户删除掉的后端图片
  figuresBuf.length &&
    dfdList.push(
      Http.post({
        url: API.DELETE_IMAGE,
        data: { id, type: "intro", urls: figuresBuf }
      })
    );
  // 更新用户新上传的本地图片
  figures.length &&
    dfdList.push(
      uploadFiles(
        figures.filter(item => item.from !== "api"),
        id,
        "intro"
      )
    );

  return Promise.all(dfdList);
};

// 获取栏目列表
export const getColumns = tid => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_INTRO_LIST,
      data: { tid, start: 0, limit: 1000 },
      enableLoading: false
    }).then(response => {
      let data = response.data.res;
      data.forEach(d => {
        let photo = d.photo;
        d.photo = photo.map(src => `${CommonService.getHost()}/${src}`);
      });
      resolve(data);
    });
  });
};

// 获取栏目详情
export const getColumnDetail = id => {
  return new Promise((resolve, reject) => {
    Http.get({ url: API.GET_INTRO, data: { id } }).then(response => {
      console.log(response);
      resolve(response.data.intro);
    });
  });
};
