import { Promise } from "../../../supports/promise-customized";
import * as API from "../../api";
import * as Http from "../../../supports/http";
import * as CommonService from "../common";

// 新增栏目
export const addColumn = (tid, title = "") => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.CREATE_STRUCTURE, data: { tid, title } }).then(res => {
      resolve(res);
    });
  });
};

// 删除栏目
export const deleteColumn = id => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.DELETE_STRUCTURE, data: { id } }).then(res => {
      resolve(res);
    });
  });
};

// 更新栏目
export const updateColumn = (id, title = "") => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_STRUCTURE, data: { _id: id, title } }).then(
      response => {
        resolve(response.data.structure);
      }
    );
  });
};

// 获取栏目列表
export const getColumns = tid => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_STRUCTURE_LIST,
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
      url: API.GET_STRUCTURE_DETAIL,
      data: { id }
    }).then(response => {
      resolve(response.data.structure);
    });
  });
};

// 创建组织栏目项
export const createItem = (formData, photo) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.CREATE_STRUCTURE_ITEM, data: { ...formData } })
      .then(response => {
        // 根据id上传图片
        const id = response.data["id"] || "";
        if (!!id) {
          CommonService.uploadFile(API.UPLOAD_PHOTO, photo.name, photo.path, {
            sid: formData.id,
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

// 删除组织栏目项
export const deleteItem = (sid, id) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.DELETE_STRUCTURE_ITEM,
      data: { sid, id }
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 更新组织栏目项详情
export const updateItem = (sid, id, formData, photo) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.UPDATE_STRUCTURE_ITEM_DETAIL,
      data: { sid, id, ...formData }
    })
      .then(response => {
        if (photo.from !== "api") {
          CommonService.uploadFile(API.UPLOAD_PHOTO, photo.name, photo.path, {
            sid,
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

// 获取组织栏目项详情
export const getItemDetail = (sid, id) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.GET_STRUCTURE_ITEM_DETAIL,
      data: { sid, id }
    })
      .then(response => {
        resolve(response.data.item);
      })
      .catch(err => {
        reject(err);
      });
  });
};
