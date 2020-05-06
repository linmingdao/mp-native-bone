import * as validator from "../../supports/validator";
import * as groupService from "../../services/handlers/group/group.js";
import { wxNavigateBack } from "../../services/services-mixin.js";

Page({
    data: {
        isPending: false,
        isSelf: false,
        currentMid: "",
        error: "",
        avatar_url: "",
        formData: {
            name: "",
            phone: "",
            remark: ""
        },
        rules: [{
            name: "name",
            rules: { required: true, message: "名字必填" }
        }]
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
                    this.setData({
                        error: errors[firstError[0]].message
                    });

                return;
            }
            if (
                this.data.formData.phone !== "" &&
                !validator.checkPhone(this.data.formData.phone)
            ) {
                this.setData({ error: "手机格式不对" });
                return;
            }

            this.setData({ isPending: true });
            const mid = this.data.currentMid;
            const tid = wx.getStorageSync("tid");
            // 更新成员信息
            groupService
                .updateMemberInfo({ mid, tid, ...this.data.formData })
                .then(() => {
                    wx.showModal({
                        title: "提示",
                        showCancel: false,
                        content: "您的信息已更新",
                        success: () => {
                            wxNavigateBack();
                        }
                    });
                })
                .catch(err => console.error(err))
                .finally(() => this.setData({ isPending: false }));
        });
    },
    onLoad({ mid }) {
        const tid = wx.getStorageSync("tid");
        groupService.getMemberInfo(tid, mid).then(memberInfo => {
            const {
                name = "",
                    phone = "",
                    avatar_url = "",
                    remark = ""
            } = memberInfo;
            this.setData({
                currentMid: mid,
                isSelf: mid === wx.getStorageSync("mid"),
                avatar_url,
                formData: { name, phone, remark }
            });
        });
    }
});