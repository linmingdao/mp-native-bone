import * as HonorService from '../../services/handlers/group/honor';
import * as CommonService from '../../services/handlers/common';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    photo: {},
    name: '',// 获奖名称
    level: '', // 奖状级别
    owner: '', // 获奖人
    date: '',// 获奖时间
    unit: '',// 获奖单位
    intro: ''// 介绍
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { hid, id } = options;
    HonorService.getItemDetail(hid, id).then(data => {
      this.setData({
        photo: {
          path: `${CommonService.getHost()}/${data.photo}`,
          from: 'api'
        },
        name: data['name'],
        level: data['level'],
        owner: data['owner'],
        date: data['date'],
        unit: data['unit'],
        intro: data['intro']
      });
    });
  }
})