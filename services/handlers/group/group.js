import { Promise } from "../../../supports/promise-customized";
import * as API from "../../api";
import * as Http from "../../../supports/http";
import * as CommonService from "../common";

// 获取成员信息
export const getMemberInfo = (tid, mid) => {
  return new Promise((resolve, reject) => {
    Http.get({ url: API.MEMBER_INFO, data: { tid, mid } })
      .then(res => {
        resolve(res.data.member);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 获取成员信息
export const updateMemberInfo = data => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_MEMBER, data })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 获取团队信息
export const getTeamInfo = tid => {
  return new Promise((resolve, reject) => {
    Http.get({ url: API.TEAM_INFO, data: { tid } })
      .then(res => {
        resolve(res.data.team);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 创建团队
export const createTeam = (data, imgs) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.CREATE_TEAM, data })
      .then(res => {
        // 根据id上传图片
        const belong_id = res.data["id"] || "";
        if (!!belong_id) {
          CommonService.uploadFiles(API.UPLOAD_PHOTO, imgs, belong_id).then(
            result => {
              resolve(result);
            }
          );
        } else {
          throw new Error("服务端没有返回社区id,可能是服务端创建社区出错");
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 更新团队
export const updateTeam = (data, imgs) => {
  // 更新团队文本信息
  const dfd = [Http.post({ url: API.UPDATE_TEAM, data })];
  // 更新团队logo图片
  const logo = imgs.logo;
  if (logo.file) {
    dfd.push(
      CommonService.uploadFile(
        API.UPLOAD_PHOTO,
        logo.name,
        logo.path,
        {
          id: data.tid,
          fieldname: logo.name,
          type: logo.type
        },
        false
      )
    );
  }
  // 并发请求
  return Promise.all(dfd);
};

// 加入团队
export const joinTeam = data => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.JOIN_TEAM, data })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 管理团队——获取栏目公开权限
export const getColumnAuthInfo = (mid, tid) => {
  return new Promise((resolve, reject) => {
    Http.get({ url: API.GET_COLUMN_AUTH, data: { mid, tid } }).then(res => {
      const auths = res.data.auths;
      console.log(res.data.auths);
      resolve(auths);
    });
  });
};

// 管理团队——更新栏目公开权限
export const updateColumnAuthInfo = (mid, tid, auths) => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.UPDATE_COLUMN_AUTH, data: { mid, tid, auths } }).then(
      res => {
        resolve(res);
      }
    );
  });
};
