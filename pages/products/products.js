// pages/resources/resources.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  go2ProductsDetail: function (e) {
    wx.navigateTo({
      url: '../productsDetail/productsDetail'
    })
  },
  onShow: function () {
    const team = wx.getStorageSync('team');
    wx.setNavigationBarTitle({
      title: team.name
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})