import { Promise } from "../../supports/promise-customized";
import { formatDate } from "../../supports/utils";
import { getHost } from "../handlers/common";
import * as API from "../api";
import * as Http from "../../supports/http";

// 获取我的发布列表
export const getMyPublishList = ({ tid, type, mid, start, limit = 5 }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_MY_PUBLISH_LIST,
      data: { mid, tid, type, start, limit },
      enableLoading: false
    }).then(response => {
      let data = response.data.data || [];
      resolve(
        data.map(item => {
          return {
            ...item,
            photo: `${getHost()}/${item["photo"][0]}`,
            date: formatDate(new Date(item["date"]), "yyyy-MM-dd")
          };
        })
      );
    });
  });
};
