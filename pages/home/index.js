import { wxNavigateTo } from "../../services/services-mixin.js";
import * as swiperService from "../../services/handlers/publishSwiper";
import * as indexService from "../../services/handlers/index";
import { getUserRole } from "../../services/handlers/login";
import { Promise } from "../../supports/promise-customized";
import { showConfirm } from "../../services/handlers/common";

Page({
  data: {
    lock: false,
    hStart: 0,
    eStart: 0,
    dStart: 0,
    hLimit: 5,
    eLimit: 5,
    dLimit: 5,
    tid: "",
    mid: "",
    role: "visitor",
    isSample: false,
    canDrag: false,
    imgUrls: [],
    visibleTab: "events", // hots, dynamics events
    hots: [],
    events: [],
    dynamics: []
  },
  onShareAppMessage() {
    const team = wx.getStorageSync("team");
    const tid = wx.getStorageSync("tid");
    return {
      title: team.name,
      path: `/pages/login/login?tid=${tid}&name=${team.name}`,
      success: function(res) {},
      fail: function(res) {}
    };
  },
  /**
   * 跳转到文章详情
   * @param {*} e
   */
  go2Detail(e) {
    if (this.data.lock) return;
    let data = e.currentTarget.dataset;
    wxNavigateTo(`../details/details?id=${data.id}&type=${data.type}`);
  },
  /**
   * 接收文章
   * @param {*} e
   */
  receive(e) {
    let data = e.currentTarget.dataset;
    indexService.receiveEvent(data.id).then(res => {
      // 改变标志位
      const idx = data.index;
      this.data.events[idx].status = 1;
      this.setData({
        events: [...this.data.events]
      });
    });
  },
  touchend() {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({
          lock: false
        });
      }, 100);
    }
  },
  /**
   * 拒绝文章
   * @param {*} e
   */
  reject(e) {
    //锁住
    this.setData({
      lock: true
    });
    let data = e.currentTarget.dataset;
    const idx = data.index;
    const id = data.id;
    const event = this.data.events[idx];
    if (!event.from_tid || (event.from_tid && event.status !== 0)) {
      return;
    }
    showConfirm("确认要拒绝该要事?", () => {
      indexService.rejectEvent(id).then(res => {
        // 删除该文章
        this.data.events.splice(idx, 1);
        this.setData({
          events: [...this.data.events]
        });
      });
    });
  },
  /**
   * 转发
   * @param {*} e
   */
  forward(e) {
    let data = e.currentTarget.dataset;
    wxNavigateTo(
      `../forwardTeamSelector/forwardTeamSelector?id=${data.id}&type=${data.type}`
    );
  },
  /**
   * 预览图片
   * @param {*} event
   */
  previewImage(event) {
    const src = event.currentTarget.dataset.src;
    const list = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: list
    });
  },
  /**
   * 切换tab
   * @param {*} e
   */
  switchTab(e) {
    const name = e.target.dataset.name;
    name && this.setData({ visibleTab: name });
    wx.pageScrollTo({ scrollTop: 0 });
  },
  go2Publish() {
    wxNavigateTo(`../publish/publish`);
  },
  /**
   * 下拉刷新
   * wx.stopPullDownRefresh
   */
  onPullDownRefresh() {
    onPullDownRefresh.call(this);
  },
  /**
   * 上拉加载更多
   */
  onReachBottom() {
    onReachBottom.call(this);
  },
  onShow() {
    updateTid.call(this);
  },
  onLoad({ visibleTab = "events" }) {
    this.setData({ visibleTab });
    updateTid.call(this);
    onPullDownRefresh.call(this, true);
  }
});

// 由于可能存在切换团队，所以需要每次都获取最新的tid
function updateTid() {
  const member = wx.getStorageSync("member");
  const team = wx.getStorageSync("team");
  const isSample = member.type === "sample";
  const tid = wx.getStorageSync("tid");
  const mid = wx.getStorageSync("mid");
  this.setData({ tid, mid, isSample });
  wx.setNavigationBarTitle({ title: team.name });
  // 获取最新的用户角色信息
  getUserRole().then(role => {
    this.setData({ role });
  });
}

function fetchData(isFirstScreen = false) {
  const {
    tid,
    mid,
    visibleTab,
    hStart,
    hLimit,
    eStart,
    eLimit,
    dStart,
    dLimit
  } = this.data;

  // 生成请求列表
  let dfd;
  if (isFirstScreen) {
    dfd = [
      // 获取轮播图列表
      swiperService.getSwipers(tid),
      // 获取推荐列表
      indexService.getHotList({ tid, mid, start: hStart, limit: hLimit }),
      // 获取要事列表
      indexService.getEventList({ tid, mid, start: eStart, limit: eLimit }),
      // 获取动态列表
      indexService.getDynamicList({ tid, mid, start: dStart, limit: dLimit })
    ];
  } else {
    if (visibleTab === "hots") {
      dfd = [
        // 获取要事列表
        indexService.getHotList({ tid, mid, start: hStart, limit: hLimit })
      ];
    } else if (visibleTab === "events") {
      dfd = [
        // 获取要事列表
        indexService.getEventList({ tid, mid, start: eStart, limit: eLimit })
      ];
    } else {
      // 获取动态列表
      dfd = [
        indexService.getDynamicList({ tid, mid, start: dStart, limit: dLimit })
      ];
    }
  }

  // 并发请求
  return Promise.all(dfd);
}

function onReachBottom() {
  // 获取当前正在显示的tab
  const visibleTab = this.data.visibleTab;

  // 获取数据
  fetchData.call(this).then(data => {
    if (visibleTab === "hots") {
      this.setData({
        canDrag: false,
        hStart: this.data.hStart + data[0].length,
        hots: [...this.data.hots, ...data[0]]
      });
    } else if (visibleTab === "events") {
      this.setData({
        canDrag: false,
        eStart: this.data.eStart + data[0].length,
        events: [...this.data.events, ...data[0]]
      });
    } else {
      this.setData({
        canDrag: false,
        dStart: this.data.dStart + data[0].length,
        dynamics: [...this.data.dynamics, ...data[0]]
      });
    }
  });
}

function onPullDownRefresh(isFirstScreen = false) {
  // 获取当前正在显示的tab
  const visibleTab = this.data.visibleTab;
  switch (visibleTab) {
    case "hots":
      this.setData({ hStart: 0 });
      break;
    case "events":
      this.setData({ eStart: 0 });
      break;
    case "dynamics":
      this.setData({ dStart: 0 });
      break;
    default:
  }

  !isFirstScreen && wx.showNavigationBarLoading();

  // 获取数据
  fetchData
    .call(this, isFirstScreen)
    .then(data => {
      // 设置数据
      if (isFirstScreen) {
        this.setData({
          imgUrls: data[0],
          hots: data[1],
          events: data[2],
          dynamics: data[3],
          eStart: data[2].length,
          dStart: data[3].length
        });
      } else {
        const visibleTab = this.data.visibleTab;
        switch (visibleTab) {
          case "hots":
            this.setData({
              hotss: data[0],
              hStart: data[0].length
            });
            break;
          case "events":
            this.setData({
              events: data[0],
              eStart: data[0].length
            });
            break;
          case "dynamics":
            this.setData({
              dynamics: data[0],
              dStart: data[0].length
            });
            break;
          default:
        }
      }
    })
    .finally(() => {
      !isFirstScreen &&
        (wx.stopPullDownRefresh(), wx.hideNavigationBarLoading());
    });
}
