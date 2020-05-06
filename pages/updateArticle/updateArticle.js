import { getHost } from "../../services/handlers/common";
import { wxNavigateBack } from "../../services/services-mixin.js";
import * as indexService from "../../services/handlers/index";
import * as publishEventsDynamicService from "../../services/handlers/publishEventsDynamic";

Page({
    data: {
        isPending: false,
        id: "",
        type: "",
        titlePlaceholder: "标题",
        contentPlaceholder: "文章内容",
        figuresBuf: [],
        figures: [],
        showAddPhotoBtn: true,
        // 表单信息
        formData: {
            title: "",
            content: ""
        }
    },
    deleteFigure(e) {
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
        wx.chooseImage({
            count: 9,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: res => {
                const tempFiles = res.tempFiles;
                let figures = this.data["figures"].concat(
                    tempFiles.map(tf => {
                        return {
                            name: "photo",
                            path: tf.path,
                            file: tf
                        };
                    })
                );
                figures.length > 9 && (figures = figures.slice(0, 9));
                this.setData({
                    figures,
                    showAddPhotoBtn: figures.length < 9
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
        // 校验必填字段信息
        if (this.data.formData.title === "") {
            this.setData({ error: "标题信息必填哟" });
            return;
        }
        if (this.data.formData.content === "") {
            this.setData({ error: "内容必填哟" });
            return;
        }
        // 校验通过
        const { id, type, figures, figuresBuf } = this.data;
        const { title, content } = this.data.formData;
        this.setData({ isPending: true });
        publishEventsDynamicService
            .updateArticle(type, id, title, content, figures, figuresBuf)
            .then(() => {
                wx.showToast({ title: "更新成功" });
                wx.reLaunch({ url: `../index/index?visibleTab=${type==='updateEvent'?'events':'dynamics'}` });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setData({ isPending: false });
            });
    },
    onLoad({ id = "", type = "" }) {
        wx.setNavigationBarTitle({
            title: type === "event" ? "编辑要事" : "编辑动态"
        });
        this.setData({
            id,
            type: type === "dynamic" ? "updateDynamic" : "updateEvent",
            titlePlaceholder: type === "event" ? "要事标题" : "动态标题",
            contentPlaceholder: type === "event" ? "要事内容" : "动态内容"
        });
        // 数据回填
        indexService
            .getDetails({ id, type })
            .then(data => {
                const { title = "", content = "", photo = [] } = data;
                this.setData({
                    formData: {
                        title,
                        content
                    },
                    figures: photo.map(path => {
                        return {
                            id: path,
                            from: "api",
                            path: `${getHost()}/${path}`
                        };
                    })
                });
            })
            .catch(err => console.error(err));
    }
});