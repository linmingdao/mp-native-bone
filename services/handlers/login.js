import { Promise } from "../../supports/promise-customized";
import { persistUserInfo } from "../handlers/common";
import { wxLogin } from "../../supports/interface-transformer";
import * as Http from "../../supports/http";
import * as API from "../api";

//获取应用实例
const app = getApp();

// 登录流程
export function login({
  userInfo,
  iv,
  encryptedData,
  shardTeamInfo = undefined
}) {
  console.log("分享的信息");
  console.log(shardTeamInfo);

  // 清空本地缓存
  wx.clearStorageSync();
  console.log("0、清空本地缓存，执行登录流程");

  return new Promise((resolve, reject) => {
    // Step_1：微信登录
    wxLogin()
      .then(wxLoginResponse => {
        console.log("1、微信登录结果");
        console.log(wxLoginResponse);
        const code = wxLoginResponse.code;

        // Step_2：社团登录
        Http.post({ url: API.LOGIN, data: { code } }).then(sjxLoginResponse => {
          console.log("2、社团服务器端登录结果");
          console.log(sjxLoginResponse);

          let openid = sjxLoginResponse["data"]["openid"];
          wx.setStorageSync("openid", openid);

          // Step_3：获取并设置登录成功的cookie
          const rheader = sjxLoginResponse["header"];
          const rcookie = rheader["set-cookie"] || rheader["Set-Cookie"];
          if (rcookie) {
            wx.setStorageSync("cookie", rcookie.split(";")[0]);
          }

          // Step_4：获取社团用户信息
          Http.post({
            url: API.PROFILE,
            data: {
              openid,
              tid: shardTeamInfo ? shardTeamInfo._id : "",
              avatar_url: userInfo.avatarUrl,
              nickname: userInfo.nickName
            }
          }).then(sjxProfileResponse => {
            console.log("3、获取社团用户信息");
            console.log(sjxProfileResponse);
            // 获取服务端返回的用户信息 并 设置缓存
            const mid = persistUserInfo(sjxProfileResponse);
            // 调用unionid接口
            Http.post({
              url: API.UNIONID,
              data: { mid, iv, encryptedData }
            }).then(() => resolve());
          });
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 获取最新的用户信息
 */
export function getUserRole() {
  return new Promise((resolve, reject) => {
    const tid = wx.getStorageSync("tid");
    const openid = wx.getStorageSync("openid");
    const { avatarUrl, nickName } = app.globalData.userInfo;
    Http.post({
      url: API.PROFILE,
      data: { openid, tid, avatar_url: avatarUrl, nickname: nickName },
      enableLoading: false
    })
      .then(profile => {
        // 获取服务端返回的用户信息 并 设置缓存
        persistUserInfo(profile);
        // 返回最新的角色信息
        resolve(profile.data.role);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}
