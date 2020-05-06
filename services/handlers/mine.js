import * as API from "../api";
import * as Http from "../../supports/http";
import { formatDate } from "../../supports/utils";
import { Promise } from "../../supports/promise-customized";

// 获取栏目列表
export const getMessageList = ({ mid, tid, start = 0, limit = 1000 }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_MESSAFE_LIST,
      data: { mid, tid, start, limit },
      enableLoading: false
    }).then(response => {
      let msg = response.data.msg || [];
      resolve(
        msg.map(item => {
          return {
            ...item,
            date: formatDate(new Date(item["date"]), "yyyy-MM-dd hh:mm:ss")
          };
        })
      );
    });
  });
};
