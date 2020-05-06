import {
  deBounce
} from '../../supports/utils';
import {
  showToast,
  wxNavigateBack
} from '../../services/services-mixin';
import * as searchService from '../../services/handlers/search';
import * as relationService from '../../services/handlers/group/relation';

Page({
  data: {
    level: '',
    join: [],
    concern: [],
    filterText: '',
    visibleTab: 'join',
    searchTeamList: []
  },
  switchTab: function (e) {
    const name = e.target.dataset.name;
    this.setData({
      visibleTab: name
    });
    if (name === 'join') {
      this.setData({
        concern: this.data.concern.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      });
    } else {
      this.setData({
        join: this.data.join.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      });
    }
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
  bindUserInput: deBounce(function (e) {
    const contenttype = e.target.dataset.contenttype;
    const value = e.detail.value.trim();
    this.setData({
      [contenttype]: value
    });
    if (value !== '') {
      // 搜索后端
      const __this = this;
      searchService.searchTeamList(value).then(list => {
        if (__this.data.visibleTab === 'join') {
          __this.setData({
            searchTeamList: list,
            join: __this.data.join.map(item => {
              return {
                ...item,
                checked: false
              }
            })
          });
        } else {
          __this.setData({
            searchTeamList: list,
            concern: __this.data.concern.map(item => {
              return {
                ...item,
                checked: false
              }
            })
          });
        }
      });
    }
  }, 600, false),
  cancelSearch: function () {
    this.setData({
      filterText: '',
      searchTeamList: []
    });
  },
  addRelation: function (e) {
    const {
      join,
      concern,
      searchTeamList
    } = this.data;
    let checkTidList = [];
    join.forEach(element => {
      if (element.checked) {
        checkTidList.push(element._id);
      }
    });
    concern.forEach(element => {
      if (element.checked) {
        checkTidList.push(element._id);
      }
    });
    searchTeamList.forEach(element => {
      if (element.checked) {
        checkTidList.push(element._id);
      }
    });
    // tid去重操作
    checkTidList = checkTidList.filter(function (element, index, self) {
      return self.indexOf(element) === index;
    });
    if (checkTidList.length) {
      // 发起请求
      const tid = wx.getStorageSync('tid');
      relationService.addRelation2Contact(tid, checkTidList, this.data.level).then(res => {
        let msg = '';
        if (res.data.repeat.length) {
          msg = res.data.repeat.map(name => `"${name}"`).join('、') + "已经在通讯录中了, 不可重复添加";
        }
        wxNavigateBack().then(() => {
          msg !== '' && showToast(msg, 4000);
        });
      });
    } else {
      showToast('请选择要添加的团队');
    }
  },
  onShow: function () {
    const __this = this;
    const mid = wx.getStorageSync('mid');
    searchService.getTeamList(mid).then(list => {
      __this.setData({
        join: list[0],
        concern: list[1]
      });
    });
  },
  onLoad: function (options) {
    this.setData({
      level: options.level
    });
  }
})