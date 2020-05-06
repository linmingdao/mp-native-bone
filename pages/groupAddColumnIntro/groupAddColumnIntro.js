import * as API from "../../services/api";
import { Promise } from '../../supports/promise-customized';
import * as commonService from "../../services/handlers/common";
import { wxNavigateBack } from "../../services/services-mixin.js";
import * as introService from "../../services/handlers/group/intro";

Page({
    data: {
        isPending: false,
        id: "",
        figuresBuf: [],
        figures: [],
        showAddPhotoBtn: true,
        // 表单信息
        formData: {
            title: "",
            content: ""
        }
    },
    deleteFigure: function(e) {
        const { figure, figureindex } = e.target.dataset;
        if (figure.from === "api") {
            this.data.figures.splice(figureindex, 1);
            this.data.figuresBuf.push(figure.id);
            this.setData({
                figuresBuf: [...this.data.figuresBuf],
                showAddPhotoBtn: this.data.figures.length < 9,
                figures: [...this.data.figures]
            });
        } else {
            this.data.figures.splice(figureindex, 1);
            this.setData({
                showAddPhotoBtn: this.data.figures.length < 9,
                figures: [...this.data.figures]
            });
        }
    },
    chooseImage() {
        const __this = this;
        wx.chooseImage({
            count: 6,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: function(res) {
                const tempFiles = res.tempFiles;
                let figures = __this.data["figures"].concat(
                    tempFiles.map(tf => {
                        return { name: "photo", type: "intro", path: tf.path, file: tf };
                    })
                );
                figures.length > 6 && (figures = figures.slice(0, 6));
                __this.setData({ figures, showAddPhotoBtn: figures.length < 6 });
            }
        });
    },
    formInputChange(e) {
        const { field } = e.currentTarget.dataset;
        this.setData({
            [field]: e.detail.value
        });
    },
    submitForm() {
        // 校验必填字段信息
        if (this.data.formData.title === '') {
            this.setData({ error: '栏目名称必填哟' });
            return;
        }
        if (this.data.formData.content === '') {
            this.setData({ error: '栏目内容必填哟' });
            return;
        }

        // 校验通过
        const { id, figuresBuf, figures } = this.data;
        const { title, content } = this.data.formData;
        this.setData({ isPending: true });
        new Promise((reslove, reject) => {
                if (id !== "") {
                    introService
                        .updateColumn(id, title, content, figures, figuresBuf)
                        .then(() => {
                            wx.showToast({ title: "更新成功" });
                            reslove();
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    const tid = wx.getStorageSync("tid");
                    introService
                        .addColumn(tid, title, content)
                        .then(data => {
                            // 上传图片
                            commonService
                                .uploadFiles(API.UPLOAD_PHOTO, figures, data.data.intro._id)
                                .then(() => {
                                    wx.showToast({ title: "新增成功" });
                                    reslove();
                                }).catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            })
            .then(() => {
                // 当前显示的tab: introductions,organizations,honors
                wx.reLaunch({ url: '../group/group?visibleTab=introductions' });
            })
            .catch(err => console.error(err))
            .finally(() => {
                this.setData({ isPending: false });
            });
    },
    onLoad: function({ id = "" }) {
        wx.setNavigationBarTitle({ title: id ? "编辑简介栏目" : "新增简介栏目" });
        this.setData({ id });
        // 数据回填
        id !== "" &&
            introService
            .getColumnDetail(id)
            .then(data => {
                this.setData({
                    formData: {
                        title: data.title || "",
                        content: data.content || "",
                    },
                    figures: data.photo.map(p => {
                        return {
                            id: p,
                            path: `${commonService.getHost()}/${p}`,
                            from: "api"
                        };
                    }) || []
                });
            })
            .catch(err => console.error(err));
    }
});