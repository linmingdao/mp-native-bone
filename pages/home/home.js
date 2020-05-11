import * as homeService from "../../services/home/index.js";
import * as notice from "../../supports/notice.js";
// 开发工具开启增强编译即可支持异步函数，无需再导入下面的库文件了
// const regeneratorRuntime = require("../../libraries/runtime.js");

Page({
  data: {
    cateItems: [
      {
        cate_id: 1,
        cate_name: "洗护",
        children: [
          {
            child_id: 1,
            name: "洁面皂uu",
            image: "../../assets/images/home/1.jpg",
          },
          {
            child_id: 2,
            name: "卸妆",
            image: "../../assets/images/home/2.jpg",
          },
        ],
      },
      {
        cate_id: 2,
        cate_name: "生鲜",
      },
    ],
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
    console.log(cateItems);
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
