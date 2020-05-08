import { Promise } from "../../supports/promise-customized";
import { getHost, persistUserInfo } from "../handlers/common";
import * as API from "../api";
import * as Http from "../../supports/http";

// 搜索团队列表
export const searchTeamList = name => {
  return new Promise((resolve, reject) => {
    Http.post({ url: API.SEARCH_TEAM, data: { name } })
      .then(result => {
        let teams = (result && result["data"] && result["data"]["teams"]) || [];
        teams = teams.map(item => {
          return {
            ...item,
            team_logo: `${getHost()}/${item.team_logo}`
          };
        });
        const tid = wx.getStorageSync("tid");
        // 过滤掉自己团队
        teams = teams.filter(item => item._id !== tid);
        resolve(teams);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

// 获取团队列表
export const getTeamList = mid => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Http.post({
        url: API.TEAM_LIST,
        data: { mid, type: "join" },
        enableLoading: false
      }),
      Http.post({
        url: API.TEAM_LIST,
        data: { mid, type: "concern" },
        enableLoading: false
      })
    ]).then(list => {
      let join = (list[0] && list[0]["data"] && list[0]["data"]["list"]) || [];
      join = join.map(item => {
        return {
          checked: false,
          ...item,
          team_logo: `${getHost()}/${item.team_logo}`
        };
      });
      const tid = wx.getStorageSync("tid");
      join = join.filter(item => item._id !== tid);
      let concern =
        (list[1] && list[1]["data"] && list[1]["data"]["list"]) || [];
      concern = concern.map(item => {
        return {
          checked: false,
          ...item,
          team_logo: `${getHost()}/${item.team_logo}`
        };
      });
      resolve([join, concern]);
    });
  });
};

// 获取加入的团队列表
export const getJoinTeamList = mid => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.TEAM_LIST,
      data: { mid, type: "join" },
      enableLoading: false
    })
      .then(response => {
        let joinList = (response["data"] && response["data"]["list"]) || [];
        const tid = wx.getStorageSync("tid");
        // joinList = joinList.filter(item => item._id !== tid);
        joinList = joinList.map(item => {
          return {
            ...item,
            team_logo: `${getHost()}/${item.team_logo}`
          };
        });
        resolve(joinList);
      })
      .catch(err => {
        console.log("获取加入的团队列表出错:");
        console.log(err);
      });
  });
};

// 获取关注的团队列表
export const getConcernTeamList = mid => {
  return new Promise((resolve, reject) => {
    Http.post({
      url: API.TEAM_LIST,
      data: { mid, type: "concern" },
      enableLoading: false
    })
      .then(response => {
        let concernList = (response["data"] && response["data"]["list"]) || [];
        concernList = concernList.map(item => {
          return {
            ...item,
            team_logo: `${getHost()}/${item.team_logo}`
          };
        });
        resolve(concernList);
      })
      .catch(err => {
        console.log("获取关注的团队列表出错:");
        console.log(err);
      });
  });
};

/**
 * 切换团队
 * @param {*} tid
 */
export const switchTeam = tid => {
  const openid = wx.getStorageSync("openid");
  return new Promise((resolve, reject) => {
    Http.post({ url: API.PROFILE, data: { openid, tid } })
      .then(res => {
        persistUserInfo(res);
        // 设置默认团队信息(即记录下一次打开app的时候显示的团队信息)
        Http.post({
          url: API.SET_DEFAULT_TEAM,
          data: { tid, mid: res.data["member"]._id }
        }).then(res => {
          resolve(res);
        });
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};
