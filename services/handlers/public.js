import { Promise } from "../../supports/promise-customized";
import { formatDate } from "../../supports/utils";
import { getHost } from "../handlers/common";
import * as API from "../api";
import * as Http from "../../supports/http";

// 获取“组织”列表
export const getStructureList = () => {
  const pid = wx.getStorageSync("pid");
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_STRUCTURE,
      data: { pid, start: 0, limit: 10000 }
    }).then(result => {
      const list = [];
      let data = result.data.res || [];
      data.forEach(item => {
        let content = item.content;
        content = content.map(item => {
          item["photo"] = `${getHost()}/${item["photo"]}`;
          return item;
        });
        item.content = content;
        list.push(item);
      });
      resolve(list);
    });
  });
};

// 获取“要事”列表
export const getFinanceList = () => {
  const pid = wx.getStorageSync("pid");
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_FINANCE,
      data: { pid, start: 0, limit: 10000 }
    }).then(result => {
      let data = result.data.res || [];
      data = data.map(item => {
        item["date"] = formatDate(new Date(item["date"]), "yyyy-MM-dd");
        return item;
      });
      resolve(data);
    });
  });
};

// 获取“政策”列表
export const getPublicList = () => {
  const pid = wx.getStorageSync("pid");
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_PUBLIC,
      data: { pid, start: 0, limit: 10000 }
    }).then(result => {
      let data = result.data.res || [];
      data = data.map(item => {
        item["date"] = formatDate(new Date(item["date"]), "yyyy-MM-dd");
        return item;
      });
      resolve(data);
    });
  });
};
