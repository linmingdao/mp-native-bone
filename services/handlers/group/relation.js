import { Promise } from "../../../supports/promise-customized";
import * as API from "../../api";
import * as Http from "../../../supports/http";
import * as CommonService from "../common";

// 获取通讯录列表
export const getColumns = id => {
  return new Promise((resolve, reject) => {
    Http.get({ url: API.GET_CONTACT, data: { id }, enableLoading: false }).then(
      res => {
        const relationData = res.data.contacts;
        let superior = relationData["superior"];
        superior = superior.map(item => {
          return {
            ...item,
            team_logo: `${CommonService.getHost()}/${item.team_logo}`
          };
        });
        let subordinate = relationData["subordinate"];
        subordinate = subordinate.map(item => {
          return {
            ...item,
            team_logo: `${CommonService.getHost()}/${item.team_logo}`
          };
        });
        let parallel = relationData["parallel"];
        parallel = parallel.map(item => {
          return {
            ...item,
            team_logo: `${CommonService.getHost()}/${item.team_logo}`
          };
        });
        resolve({
          superior,
          subordinate,
          parallel
        });
      }
    );
  });
};

// 添加关系至通讯录
export const addRelation2Contact = (tid, contactIdList, type) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.JOIN_CONTACT,
      data: { tid: contactIdList, contact_id: tid, type }
    }).then(res => {
      resolve(res);
    });
  });
};

// 接收关系请求
export const acceptRelationRequest = id => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.AUDIT_CONTACT,
      data: { id, status: 1 },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 拒绝关系请求
export const rejectRelationRequest = id => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.AUDIT_CONTACT,
      data: { id, status: 2 },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 删除通讯录中的关系
export const deleteRelation = (tid, contact_id, type) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.DELETE_CONTACT,
      data: { tid, contact_id, type },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 获取团队成员列表
export const getTeamMemberList = ({
  tid,
  ownerMid,
  status = 1,
  start = 0,
  limit = 10000000000
}) => {
  return new Promise((resolve, reject) => {
    Http.get({
      url: API.GET_TEM_MEMBER,
      data: { tid, status, start, limit },
      enableLoading: false
    }).then(res => {
      let { members = [], total } = res.data;
      if (members.length) {
        members = members.map(m => {
          return {
            ...m,
            id_photo: `${CommonService.getHost()}/${m.id_photo}`
          };
        });
        // 找到团队创建者
        const creatorArr = members.filter(item => item.role === 1);
        // 找到管理员
        const adminArr = members.filter(item => item.role === 2);
        // 找到普通用户
        const memberArr = members.filter(item => item.role === 3);
        resolve({ members: [...creatorArr, ...adminArr, ...memberArr], total });
      } else {
        resolve({ members: [], total: 0 });
      }
    });
  });
};

// 删除成员
export const deleteMember = (tid, mid) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.DELETE_MEMBER,
      data: { tid, mid },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 接受成员请求
export const acceptMember = (tid, mid) => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.AUDIT_MEMBER,
      data: { tid, mid, status: 1, note: "小程序端管理员通过成员请求" },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 拒绝成员请求
export const rejectsMember = (tid, mid) => {
  console.log("reject");
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.AUDIT_MEMBER,
      data: { tid, mid, status: 2, note: "小程序端管理员拒绝成员请求" },
      enableLoading: false
    }).then(res => {
      resolve(res);
    });
  });
};

// 获取团队二维码
export const getTeamQRCode = tid => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.TEAM_QR_CODE, data: {}, enableLoading: false }).then(
      res => {
        console.log(res);
      }
    );
  });
};
