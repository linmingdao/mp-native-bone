import { Promise } from "../../supports/promise-customized";
import * as API from "../api";
import * as Http from "../../supports/http";
import * as CommonService from "./common";

// 获取团队成员列表
export const getPermissionMemberList = ({ tid, ownerMid, status = 1 }) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_PERMISSION_MEMBER_LIST,
      data: { tid, status, start: 0, limit: 1000000 },
      enableLoading: false
    }).then(res => {
      let members = res.data.member || [];
      if (members.length) {
        resolve(members.filter(item => item._id !== ownerMid));
      } else {
        resolve([]);
      }
    });
  });
};

// 获取团队成员列表
export const setMemberToAdmin = ({ tid, mids = [] }) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.SET_MEMBER_TO_ADMIN,
      data: { tid, mids },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};
