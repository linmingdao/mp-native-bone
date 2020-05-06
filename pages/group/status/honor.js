import { Promise } from "../../../supports/promise-customized";
import * as HonorService from "../../../services/handlers/group/honor";

export default function(context) {
  return {
    // 展开手风琴
    expand(e) {
      const expandIdx = e.currentTarget.dataset.expandidx;
      if (expandIdx) {
        let [name, idx] = expandIdx.split(":");
        idx = parseInt(idx);
        context.setData({
          expandHorIdx: context.data["expandHorIdx"] !== idx ? idx : -1
        });
      }
    },
    // 添加栏目
    addColumn() {
      //跳转到简介添加|编辑页面
      wx.navigateTo({
        url: '../groupAddColumOrgHonor/groupAddColumOrgHonor?type="honor"&id='
      });
    },
    // 删除栏目
    deleteColumn(e) {
      const id = e.target.dataset.id;
      const idx = e.target.dataset.idx;
      HonorService.deleteColumn(id).then(res => {
        let columns = context.data["honors"];
        columns = columns.filter((item, index) => index !== idx);
        context.setData({
          honors: [...columns]
        });
      });
    },
    // 获取栏目列表
    getColumns() {
      return new Promise((resolve, reject) => {
        const tid = wx.getStorageSync("tid");
        HonorService.getColumns(tid).then(data => {
          context.setData({
            honors: data || []
          });
          resolve();
        });
      });
    },
    // 编辑栏目
    editColumn(e) {
      const id = e.target.dataset.id;
      //跳转到简介添加|编辑页面
      wx.navigateTo({
        url: `../groupAddColumOrgHonor/groupAddColumOrgHonor?type="honor"&id=${id}`
      });
    },
    // 新增item
    addItem(e) {
      const hid = e.currentTarget.dataset.hid;
      wx.navigateTo({
        url: `../groupAddItemHonor/groupAddItemHonor?hid=${hid}`
      });
    },
    // 删除item
    deleteItem(e) {
      const { hid, id, columnidx, idx } = e.target.dataset;
      HonorService.deleteItem(hid, id).then(() => {
        let columns = context.data["honors"];
        let column = columns[columnidx];
        column.content.splice(idx, 1);
        context.setData({
          honors: [...columns]
        });
      });
    },
    // 编辑item
    editItem(e) {
      const { hid, id } = e.target.dataset;
      wx.navigateTo({
        url: `../groupAddItemHonor/groupAddItemHonor?hid=${hid}&id=${id}`
      });
    },
    // 查看item详情
    itemDetail(e) {
      const { hid, id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../groupDetailHonor/groupDetailHonor?hid=${hid}&id=${id}`
      });
    }
  };
}
