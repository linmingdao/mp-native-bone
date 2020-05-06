import { Promise } from "../../supports/promise-customized";
import { formatDate } from "../../supports/utils";
import * as API from "../api";
import * as Http from "../../supports/http";

// 发表评论
export const comment = ({ tid, id, type, mid, content = "" }) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.COMMENT,
      data: { tid, id, type, mid, content },
      enableLoading: false
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

// 获取评论
export const getComments = ({ tid, id, start = 0, limit = 5 }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GETS_COMMENT,
      data: { tid, id, start, limit },
      enableLoading: false
    })
      .then(response => {
        const data = response.data.res || [];
        resolve(
          data.map(item => {
            return {
              ...item,
              date: formatDate(new Date(item.date))
            };
          })
        );
      })
      .catch(() => reject([]));
  });
};

// 删除评论
export const deleteComment = ({ tid, id }) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.DELETE_COMMENT,
      data: { tid, id },
      enableLoading: false
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
