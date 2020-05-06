import * as groupService from "../../services/handlers/group/group.js";
import * as commonService from "../../services/handlers/common.js";
import { wxReLaunch } from "../../services/services-mixin.js";

Page({
  data: {
    isPending: false,
    isAdmin: false,
    isTeamOwner: false,
    // 团队logo
    team_logo: {
      name: "team_logo",
      type: "team",
      path: "",
      file: null
    },
    formData: {
      name: "", // 团队名称
      industry: "", // 行业分类
      province: "", // 省份
      city: "", // 城市
      area: "", // 区
      addr: "", // 详细地址
      creator_name: "" // 创建者姓名
    },
    rules: [
      {
        name: "name",
        rules: { required: true, message: "团队名称必填" }
      }
    ]
  },
  chooseImage: function(e) {
    if (!this.data.isAdmin) return;
    const { field } = e.target.dataset;
    const __this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const tempFilePaths = res.tempFilePaths;
        const tempFiles = res.tempFiles;
        __this.setData({
          [field]: {
            name: field,
            type: "team",
            path: tempFilePaths[0],
            file: tempFiles[0]
          }
        });
      }
    });
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  submitForm() {
    this.selectComponent("#form").validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({ error: errors[firstError[0]].message });
        }
      } else {
        if (this.data["team_logo"].path !== "") {
          commonService.showConfirm(
            "更新后，成员需要重新登录福信小程序才能获取到最新的团队信息，请谨慎更新团队信息哟",
            () => {
              this.setData({ isPending: true });
              groupService
                .updateTeam(
                  {
                    ...this.data.formData,
                    tid: wx.getStorageSync("tid")
                  },
                  {
                    logo: this.data["team_logo"]
                  }
                )
                .then(() => {
                  wx.showModal({
                    title: "提示",
                    showCancel: false,
                    content:
                      "团队信息已更新，需要重新登录以获取更新后的团队信息",
                    success: () => wxReLaunch("../login/login")
                  });
                })
                .catch(err => console.error(err))
                .finally(() => this.setData({ isPending: false }));
            }
          );
        } else {
          this.setData({ error: "还没上传团队logo哟" });
        }
      }
    });
  },
  onLoad: function() {
    this.setData({ isTeamOwner: wx.getStorageSync("isTeamOwner") });
    groupService.getTeamInfo(wx.getStorageSync("tid")).then(teamInfo => {
      const {
        mid = {},
        name = "",
        province = "",
        city = "",
        area = "",
        team_logo = "",
        industry = "",
        addr = ""
      } = teamInfo;
      const creator_name = mid.name;
      this.setData({
        isAdmin: wx.getStorageSync("role") === "admin",
        formData: {
          name,
          industry,
          province,
          city,
          area,
          addr,
          creator_name
        },
        "team_logo.path": `${commonService.getHost()}/${team_logo}`
      });
    });
  }
});
