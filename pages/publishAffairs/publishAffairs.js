import * as publishEventsDynamicService from "../../services/handlers/publishEventsDynamic";

Page({
  data: {
    isPending: false,
    error: "",
    type: "",
    titlePlaceholder: "",
    contentPlaceholder: "",
    figures: [],
    showAddPhotoBtn: true,
    // 表单信息
    formData: {
      title: "",
      content: "",
    },
  },
  deleteFigure(e) {
    const { figureindex } = e.target.dataset;
    this.data.figures.splice(figureindex, 1);
    this.setData({
      showAddPhotoBtn: this.data.figures.length < 9,
      figures: [...this.data.figures],
    });
  },
  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFiles = res.tempFiles;
        let figures = this.data["figures"].concat(
          tempFiles.map((tf) => {
            return {
              name: "photo",
              path: tf.path,
              file: tf,
            };
          })
        );
        figures.length > 9 && (figures = figures.slice(0, 9));
        this.setData({
          figures,
          showAddPhotoBtn: figures.length < 9,
        });
      },
    });
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value,
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
    const tid = wx.getStorageSync("tid");
    const mid = wx.getStorageSync("mid");
    const { type, figures } = this.data;
    const { title, content } = this.data.formData;
    this.setData({ isPending: true });
    publishEventsDynamicService
      .createArticle(tid, mid, title, content, figures, type)
      .then(() => {
        wx.showToast({ title: "发布成功" });
        wx.reLaunch({
          url: `../index/index?visibleTab=${
            type === "event" ? "events" : "dynamics"
          }`,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => this.setData({ isPending: false }));
  },
  onLoad({ type = "" }) {
    wx.setNavigationBarTitle({ title: type === "event" ? "要事" : "动态" });
    const titlePlaceholder = type === "event" ? "要事标题" : "动态标题";
    const contentPlaceholder = type === "event" ? "要事内容" : "动态内容";
    this.setData({ type, titlePlaceholder, contentPlaceholder });
  },
});
