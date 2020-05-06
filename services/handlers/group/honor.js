import { Promise } from "../../../supports/promise-customized";
import * as API from "../../api";
import * as Http from "../../../supports/http";
import * as CommonService from "../common";

// 新增栏目
export const addColumn = (tid, title = "") => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.CREATE_HONOR, data: { tid, title } }).then(res => {
      resolve(res);
    });
  });
};

// 删除栏目
export const deleteColumn = id => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.DELETE_HONOR, data: { id } }).then(res => {
      resolve(res);
    });
  });
};

// 更新栏目
export const updateColumn = (id, title = "") => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_HONOR, data: { _id: id, title } }).then(
      response => {
        resolve(response.data.honor);
      }
    );
  });
};

// 获取栏目列表
export const getColumns = tid => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_HONOR_LIST,
      data: { tid, start: 0, limit: 1000 },
      enableLoading: false
    }).then(response => {
      let data = response.data.res || [];
      data.forEach(d => {
        d.content = d.content.map(c => {
          return {
            ...c,
            photo: `${CommonService.getHost()}/${c.photo}`
          };
        });
      });
      resolve(data);
    });
  });
};

// 获取栏目详情
export const getColumnDetail = id => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_HONOR_DETAIL,
      data: { id }
    }).then(response => {
      resolve(response.data.honor);
    });
  });
};

// 创建荣誉栏目项
export const createItem = (formData, photo) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.CREATE_HONOR_ITEM, data: { ...formData } })
      .then(response => {
        // 根据id上传图片
        const id = response.data["id"] || "";
        if (!!id) {
          CommonService.uploadFile(API.UPLOAD_PHOTO, photo.name, photo.path, {
            hid: formData.id,
            id,
            fieldname: photo.name,
            type: photo.type
          }).then(result => {
            resolve(result);
          });
        } else {
          throw new Error("服务端没有返回item id,可能是服务端创建item出错");
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 删除荣誉栏目项
export const deleteItem = (hid, id) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.DELETE_HONOR_ITEM, data: { hid, id } })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 更新荣誉栏目项详情
export const updateItem = (hid, id, formData, photo) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.UPDATE_HONOR_ITEM_DETAIL,
      data: { hid, id, ...formData }
    })
      .then(response => {
        if (photo.from !== "api") {
          CommonService.uploadFile(API.UPLOAD_PHOTO, photo.name, photo.path, {
            hid,
            id,
            fieldname: photo.name,
            type: photo.type
          }).then(result => {
            resolve(result);
          });
        } else {
          resolve(response);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 获取荣誉栏目项详情
export const getItemDetail = (hid, id) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.GET_HONOR_ITEM_DETAIL, data: { hid, id } })
      .then(response => {
        resolve(response.data.item);
      })
      .catch(err => {
        reject(err);
      });
  });
};
