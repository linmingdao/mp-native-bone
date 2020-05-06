import { Promise } from "../../supports/promise-customized";
import { formatDate } from "../../supports/utils";
import { getHost } from "../handlers/common";
import * as API from "../api";
import * as Http from "../../supports/http";

// 获取“推荐”列表
export const getHotList = ({ tid, mid, start, limit }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_HOT_LIST,
      data: {
        tid,
        mid,
        start,
        limit
      },
      enableLoading: false
    }).then(result => {
      let hots = result.data.res || [];
      hots = hots.map(item => {
        item["photo"] = `${getHost()}/${item["photo"][0]}`;
        item["date"] = formatDate(new Date(item["date"]), "yyyy-MM-dd");
        return item;
      });
      resolve(hots);
    });
  });
};

// 获取“要事”列表
export const getEventList = ({ tid, mid, start, limit }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_EVENT_LIST,
      data: { tid, mid, start, limit },
      enableLoading: false
    }).then(result => {
      let events = result.data.res || [];
      events = events.map(item => {
        item["photo"] = `${getHost()}/${item["photo"][0]}`;
        item["date"] = formatDate(new Date(item["date"]), "yyyy-MM-dd");
        return item;
      });
      resolve(events);
    });
  });
};

// 获取“动态”列表
export const getDynamicList = ({ tid, mid, start, limit }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_DYNAMIC_LIST,
      data: { tid, mid, start, limit },
      enableLoading: false
    }).then(result => {
      let dynamics = result.data.res || [];
      dynamics = dynamics.map(item => {
        item["photo"] = item["photo"].map(pSrc => `${getHost()}/${pSrc}`);
        item["date"] = formatDate(new Date(item["date"]), "yyyy-MM-dd");
        return item;
      });
      resolve(dynamics);
    });
  });
};

const DETAIL_MAP = {
  recommend: API.GET_HOT_DETAILS,
  event: API.GET_EVENT_DETAILS,
  dynamic: API.GET_DYNAMIC_DETAILS
};

// 获取"动态详情" Dynamic
export const getDetails = ({ id, type, intercepter }) => {
  return new Promise((resolve, reject) => {
    Http.get({ url: DETAIL_MAP[type], data: { id }, intercepter }).then(res => {
      const data = res.data[type];
      // data.photo = data['photo'].map(item => `${getHost()}/${item}`);
      data["date"] = formatDate(new Date(data["date"]), "yyyy-MM-dd");
      resolve(res.data[type]);
    });
  });
};

// 转发要事
export const forwardEvent = (id, tids) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.FORWARD_EVENT,
      data: { type: "event", id, tids }
    }).then(res => {
      resolve(res);
    });
  });
};

// 接收要事
export const receiveEvent = id => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_EVENT, data: { id, status: 1 } }).then(res => {
      resolve(res);
    });
  });
};

// 拒绝要事
export const rejectEvent = id => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_EVENT, data: { id, status: 2 } }).then(res => {
      resolve(res);
    });
  });
};

export const deleteArticle = (type, id) => {
  const url = type === "dynamic" ? API.DELETE_DYNAMIC : API.DELETE_EVENT;
  return new Promise((resolve, reject) => {
    Http.post({ url, data: { id } }).then(res => {
      resolve(res);
    });
  });
};
