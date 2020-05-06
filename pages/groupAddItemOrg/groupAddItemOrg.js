import * as validator from "../../supports/validator";
import * as OrgService from "../../services/handlers/group/org";
import * as CommonService from "../../services/handlers/common";
import { Promise } from "../../supports/promise-customized";

Page({
    data: {
        isPending: false,
        // 组织栏目id
        sid: "",
        // 组织栏目item id
        id: "",
        // 免冠照
        photo: null,
        // 表单信息
        formData: {
            // 名字
            name: "",
            // 年龄
            age: "",
            // 民族
            nation: "",
            // 学历
            education: "",
            // 头衔
            job_title: "",
            // 职务
            job: "",
            // 电话
            phone: "",
            // 简介
            intro: ""
        },
        // 校验规则
        rules: [{
                name: "name",
                rules: { required: true, message: "名字必填哟" }
            },
            {
                name: "job",
                rules: [{ required: true, message: "职责必填哟" }]
            }
            // ,
            // {
            //   name: "job_title",
            //   rules: [{ required: true, message: "头衔信息必填哟" }]
            // },
            // {
            //     name: "phone",
            //     rules: [
            //         { required: true, message: "电话信息必填哟" },
            //         { mobile: true, message: "电话格式不对哟" }
            //     ]
            // }
        ]
    },
    chooseImage(e) {
        const { field } = e.target.dataset;
        wx.chooseImage({
            count: 1,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: res => {
                const tempFilePaths = res.tempFilePaths;
                const tempFiles = res.tempFiles;
                this.setData({
                    [field]: {
                        name: "photo",
                        type: "structure",
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
            // 校验必填字段信息
            if (!valid) {
                const firstError = Object.keys(errors);
                firstError.length &&
                    this.setData({ error: errors[firstError[0]].message });
                return;
            }
            // 校验是否有上传个人正面照
            const { photo = null } = this.data;
            if (!photo) {
                this.setData({ error: "还没上传个人正面照哟" });
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

            // 校验通过
            const { sid, id, formData } = this.data;
            this.setData({ isPending: true });
            new Promise((resolve, reject) => {
                    if (id !== "") {
                        OrgService.updateItem(sid, id, formData, photo)
                            .then(() => {
                                wx.showToast({ title: "更新成功" });
                                resolve();
                            })
                            .catch(err => reject(err));
                    } else {
                        OrgService.createItem({...formData, id: sid }, photo)
                            .then(() => {
                                wx.showToast({ title: "新增成功" });
                                resolve();
                            })
                            .catch(err => reject(err));
                    }
                })
                .then(() => {
                    wx.reLaunch({ url: "../group/group?visibleTab=organizations" });
                })
                .catch(err => console.error(err))
                .finally(() => this.setData({ isPending: false }));
        });
    },
    onLoad({ id = "", sid = "" }) {
        wx.setNavigationBarTitle({ title: id ? "编辑组织信息" : "新增组织信息" });
        this.setData({ id, sid });
        id !== "" &&
            OrgService.getItemDetail(sid, id)
            .then(data => {
                const {
                    name,
                    age,
                    nation,
                    education,
                    job_title,
                    job,
                    phone,
                    intro
                } = data;
                // 数据回填
                this.setData({
                    photo: {
                        path: `${CommonService.getHost()}/${data.photo}`,
                        from: "api"
                    },
                    formData: {
                        name,
                        age,
                        nation,
                        education,
                        job_title,
                        job,
                        phone,
                        intro
                    }
                });
            })
            .catch(err => console.error(err));
    }
});