App({
  onLaunch: function () {
    let _this = this;
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (!res.hasUpdate) {
          // 获取用户信息
          wx.getSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: (res) => {
                    // 可以将 res 发送给后台解码出 unionId
                    _this.globalData.userInfo = res.userInfo;
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (_this.userInfoReadyCallback) {
                      _this.userInfoReadyCallback(res);
                    }
                  },
                });
              }
            },
          });
        }
      });
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: "已经有新版本了哟~",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
        });
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "您的微信版本过低，建议升级到最新版本。",
      });
    }
  },
  globalData: {
    userInfo: null,
  },
});
