Page({
  data: {
    isTeamOwner: false
  },
  onShow() {
    const isTeamOwner = wx.getStorageSync("isTeamOwner");
    this.setData({ isTeamOwner });
  }
});
