import * as homeService from "../../services/home/index.js";
import * as notice from "../../supports/notice.js";
// 开发工具开启增强编译即可支持异步函数，无需再导入下面的库文件了
// const regeneratorRuntime = require("../../libraries/runtime.js");

Page({
  data: {
    cateItems: [],
    curNav: 1,
    curIndex: 0,
  },
  switchRightTab: function (e) {
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    this.setData({
      curNav: id,
      curIndex: index,
    });
  },
  // 支持使用异步函数
  async getCategoryData() {
    notice.showLoading();
    const cateItems = await homeService.getCategoryData();
    this.setData({ cateItems });
    notice.hideLoading();
  },
  // getCategoryData() {
  //   notice.showLoading();
  //   homeService.getCategoryData().then((cateItems) => {
  //     this.setData({ cateItems });
  //     notice.hideLoading();
  //   });
  // },
  onShow() {
    console.log("onShow");
  },
  onLoad() {
    this.getCategoryData();
    console.log("onLoad");
  },
});
