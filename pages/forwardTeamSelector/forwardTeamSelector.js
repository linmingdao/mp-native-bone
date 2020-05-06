import {
  showToast,
  wxNavigateBack
} from '../../services/services-mixin';
import * as relationService from '../../services/handlers/group/relation';
import * as indexService from '../../services/handlers/index';

Page({
  data: {
    id: '',
    type: '',
    superior: [],
    subordinate: [],
    parallel: []
  },
  checkTeam: function (e) {
    const {
      type,
      index
    } = e.currentTarget.dataset;
    if (this.data[type][index].checked) {
      this.data[type][index].checked = false
    } else {
      this.data[type][index].checked = true
    }
    this.setData({
      [type]: [...this.data[type]]
    });
  },
  addRelation: function (e) {
    const {
      id,
      superior,
      subordinate,
      parallel
    } = this.data;
    const mixinTeamList = [...superior, ...subordinate, ...parallel];
    let checkTidList = [];
    mixinTeamList.forEach(element => {
      if (element.checked) {
        checkTidList.push(element._id);
      }
    });
    if (checkTidList.length) {
      // 发起请求
      indexService.forwardEvent(id, checkTidList).then(res => {
        wxNavigateBack().then(() => {
          showToast('转发成功');
        });
      });
    } else {
      showToast('请选择要转发的团队');
    }
  },
  onShow: function () {
    const tid = wx.getStorageSync('tid');
    relationService.getColumns(tid).then(data => {
      this.setData({
        superior: data.superior,
        subordinate: data.subordinate,
        parallel: data.parallel,
      });
    });
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: options.type
    });
  }
})