import * as swiperService from "../../services/handlers/publishSwiper";
import { wxNavigateBack } from "../../services/services-mixin.js";

const MAX_NUM = 6;

Page({
    data: {
        isPending: false,
        photoBuf: [],
        swiperList: [],
        showAddPhotoBtn: true
    },
    deleteFigure(e) {
        const { figure, figureindex } = e.target.dataset;
        if (figure.from === "api") {
            this.data.swiperList.splice(figureindex, 1);
            this.data.photoBuf.push(figure.id);
            this.setData({
                photoBuf: [...this.data.photoBuf],
                showAddPhotoBtn: this.data.swiperList.length < MAX_NUM,
                swiperList: [...this.data.swiperList]
            });
        } else {
            this.data.swiperList.splice(figureindex, 1);
            this.setData({
                showAddPhotoBtn: this.data.swiperList.length < MAX_NUM,
                swiperList: [...this.data.swiperList]
            });
        }
    },
    chooseImage() {
        wx.chooseImage({
            count: MAX_NUM,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: res => {
                const tempFiles = res.tempFiles;
                let swiperList = this.data["swiperList"].concat(
                    tempFiles.map(tf => {
                        return {
                            name: "photo",
                            path: tf.path,
                            file: tf
                        };
                    })
                );
                swiperList.length > MAX_NUM &&
                    (swiperList = swiperList.slice(0, MAX_NUM));
                this.setData({
                    swiperList,
                    showAddPhotoBtn: swiperList.length < MAX_NUM
                });
            }
        });
    },
    publishSwipers() {
        const tid = wx.getStorageSync("tid");
        const swiperList = this.data["swiperList"].filter(f => f.from !== "api");
        const photoBuf = this.data["photoBuf"];
        if (!swiperList.length && !photoBuf.length) {
            wx.reLaunch({ url: '../index/index' });
            return;
        }
        // 发布轮播图
        this.setData({ isPending: true });
        swiperService
            .publishSwipers(photoBuf, swiperList, tid)
            .then(() => {
                wx.showToast({ icon: "success" });
                wxNavigateBack();
                wx.reLaunch({ url: '../index/index' });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setData({ isPending: false });
            });
    },
    onLoad() {
        const tid = wx.getStorageSync("tid");
        swiperService.getSwipers(tid).then(data => {
            this.setData({
                swiperList: data,
                showAddPhotoBtn: data.length < MAX_NUM
            });
        });
    }
});