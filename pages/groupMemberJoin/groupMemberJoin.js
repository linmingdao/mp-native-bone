import * as validator from "../../supports/validator";
import { wxNavigateBack } from "../../services/services-mixin.js";
import * as groupService from "../../services/handlers/group/group.js";

Page({
  data: {
    isPending: false,
    error: "",
    formData: {
      name: "",
      phone: "",
      remark: ""
    },
    rules: [
      {
        name: "name",
        rules: { required: true, message: "名字是必填项哟" }
      }
    ]
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
        firstError.length &&
          this.setData({ error: errors[firstError[0]].message });
        return;
      }

      // 手动校验手机号码
      if (
        this.data.formData.phone !== "" &&
        !validator.checkPhone(this.data.formData.phone)
      ) {
        this.setData({ error: "手机号码格式有误哟" });
        return;
      }

      // 通过校验，执行申请加入团队的请求
      this.setData({ isPending: true });
      const mid = wx.getStorageSync("mid");
      const tid = wx.getStorageSync("tid");
      groupService
        .joinTeam({ ...this.data.formData, mid, tid })
        .then(() =>
          wx.showModal({
            title: "提示",
            showCancel: false,
            content: "加入团队申请已提交，请耐心等待管理员审核",
            success: () => wxNavigateBack()
          })
        )
        .catch(err => console.error(err))
        .finally(() => this.setData({ isPending: false }));
    });
  }
});
