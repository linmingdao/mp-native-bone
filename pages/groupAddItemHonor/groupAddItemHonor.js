import { Promise } from '../../supports/promise-customized';
import * as HonorService from "../../services/handlers/group/honor";
import * as CommonService from "../../services/handlers/common";

Page({
    data: {
        isPending: false,
        // column id
        hid: "",
        // item id
        id: "",
        photo: null,
        // 表单信息
        formData: {
            // 获奖名称
            name: "",
            // 奖状级别
            level: "",
            // 获奖人
            owner: "",
            // 获奖时间
            date: "",
            // 获奖单位
            unit: "",
            // 介绍
            intro: ""
        },
        // 校验规则
        rules: [{
                name: "name",
                rules: { required: true, message: "风采名称必填" }
            },
            {
                name: "level",
                rules: [{ required: true, message: "级别信息必填" }]
            },
            {
                name: "unit",
                rules: [{ required: true, message: "单位信息必填" }]
            }
        ]
    },
    bindDateChange(e) {
        const { field } = e.target.dataset;
        this.setData({
            [`formData.${field}`]: e.detail.value
        });
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
                        type: "honor",
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
            // 校验是否有上传风采图片
            const { photo = null } = this.data;
            if (!photo) {
                this.setData({ error: "还没上传风采图片哟" });
                return;
            }
            // 校验通过
            const { hid = "", id = "", formData = {} } = this.data;
            this.setData({ isPending: true });
            new Promise((resolve, reject) => {
                    if (id !== "") {
                        HonorService.updateItem(hid, id, formData, photo)
                            .then(() => {
                                wx.showToast({ title: "更新成功" });
                                resolve();
                            })
                            .catch(err => reject(err));
                    } else {
                        HonorService.createItem({ id: hid, ...formData }, photo)
                            .then(() => {
                                wx.showToast({ title: "新增成功" });
                                resolve();
                            })
                            .catch(err => reject(err));
                    }
                }).then(() => {
                    wx.reLaunch({ url: '../group/group?visibleTab=honors' });
                })
                .catch(err => console.error(err))
                .finally(() => this.setData({ isPending: false }));
        });
    },
    onLoad({ id = "", hid = "" }) {
        this.setData({ id, hid });
        wx.setNavigationBarTitle({ title: id ? "编辑风采信息" : "新增风采信息" });
        if (id !== "") {
            HonorService.getItemDetail(hid, id)
                .then(data => {
                    const { name, level, owner, date, unit, intro } = data;
                    // 数据回填
                    this.setData({
                        photo: {
                            path: `${CommonService.getHost()}/${data.photo}`,
                            from: "api"
                        },
                        formData: {
                            name,
                            level,
                            owner,
                            date,
                            unit,
                            intro
                        }
                    });
                })
                .catch(err => console.error(err));
        } else {
            const date = new Date();
            this.setData({
                formData: {
                    ...this.data.formData,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                }
            });
        }
    }
});