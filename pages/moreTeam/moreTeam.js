import {
  deBounce
} from '../../supports/utils';
import moreTeamService from './status/moreTeamService';

Page({
  data: {
    filterText: '',
    searchTeamList: [],
    // 状态机
    status: {},
    // 关系显示的tab: join, concern
    relVisibleTab: 'join',
    // 加入的团队
    join: [],
    // 关注的团队
    concern: [],
  },
  switchTab: function (e) {
    this.data.status['relations'].switchTab(e);
  },
  switchTeam: function (e) {
    this.data.status["relations"].switchTeam(e);
  },
  bindUserInput: deBounce(function (e) {
    this.data.status['relations'].bindUserInput(e);
  }, 600, false),
  cancelSearch: function () {
    this.setData({
      filterText: '',
      searchTeamList: []
    });
  },
  switchTeamFromSearchResult: function (e) {
    this.data.status['relations'].switchTeamFromSearchResult(e);
  },
  onShow: function () {
    this.data.status['relations'].getColumns();
  },
  onLoad: function () {
    this.setData({
      status: {
        'relations': moreTeamService(this)
      }
    });
  }
});