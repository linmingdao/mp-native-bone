import * as API from "../api";
import * as CommonService from "./common";
import * as Http from "../../supports/http";
import { Promise } from "../../supports/promise-customized";

/**
 * 上传一张轮播图
 * @param {*} swiper 轮播图file对象
 * @param {*} payload 额外的表单数据
 */
const uploadSwiper = (swiper, payload) => {
  return new Promise((resolve, reject) => {
    // Step1: 调用创建轮播图接口
    Http.post({ url: API.CREAT_CAROUSELFIGURE, data: { ...payload } })
      .then(data => {
        // Step2: 调用上传图片接口
        const id = data.data.carouselfigure._id;
        const type = "carousel-figure";
        CommonService.uploadFile(API.UPLOAD_PHOTO, swiper.name, swiper.path, {
          id,
          type
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

/**
 * 批量上传轮播图
 * @param {*} swiperList
 * @param {*} tid
 */
const uploadSwipers = (swiperList, tid) => {
  // 生成异步请求列表
  const dfdList = swiperList.map((file, index) => {
    return uploadSwiper(file, {
      tid: tid,
      order: index
    });
  });

  // 并发请求
  return Promise.all(dfdList);
};

/**
 * 发布轮播图
 * @param {Object} swipers 轮播图列表
 * @param {String} tid 社团id
 */
export const publishSwipers = (photoBuf = [], swipers = [], tid) => {
  const dfdList = [];
  if (photoBuf.length) {
    dfdList.push(deleteSwiperById(photoBuf));
  }
  if (swipers.length) {
    dfdList.push(_publishSwipers(swipers, tid));
  }
  return Promise.all(dfdList);
};

/**
 * 发布轮播图
 * @param {Object} swipers 轮播图列表
 * @param {String} tid 社团id
 */
export const _publishSwipers = (swipers = [], tid) => {
  return new Promise((resolve, reject) => {
    uploadSwipers(swipers, tid)
      .then(result => {
        console.log("上传轮播图成功:");
        console.log(result);
        resolve(result);
      })
      .catch(err => {
        console.log("上传轮播图失败:");
        console.log(err);
        reject(err);
      });
  });
};

/**
 * 删除轮播图
 * @param {Object} swipers
 * @param {String} tid
 */
export const deleteSwiperById = idList => {
  return Http.post({ url: API.DELETE_CAROUSELFIGURE, data: { id: idList } });
};

/**
 * 获取轮播图列表
 * @param {String} tid
 */
export const getSwipers = tid => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_CAROUSELFIGURE_LIST,
      data: { tid, start: 0, limit: 10, status: 1 },
      enableLoading: false
    }).then(data => {
      let list = (data && data.data && data.data.res) || [];
      list = list
        .filter(item => item["photo"].length > 0)
        .map(item => {
          return {
            path: `${API.HOST}/${item["photo"][0]}`,
            id: item._id,
            from: "api"
          };
        });
      resolve(list);
    });
  });
};
