import { Promise } from "../../../supports/promise-customized";
import * as OrgService from "../../../services/handlers/group/org";

export default function(context) {
  return {
    // 展开手风琴
    expand(e) {
      const expandIdx = e.currentTarget.dataset.expandidx;
      if (expandIdx) {
        let [name, idx] = expandIdx.split(":");
        idx = parseInt(idx);
        context.setData({
          expandOrgIdx: context.data["expandOrgIdx"] !== idx ? idx : -1
        });
      }
    },
    // 添加栏目
    addColumn() {
      //跳转到简介添加|编辑页面
      wx.navigateTo({
        url: "../groupAddColumOrgHonor/groupAddColumOrgHonor?type=org&id="
      });
    },
    // 删除栏目
    deleteColumn(e) {
      const { idx, id } = e.target.dataset;
      OrgService.deleteColumn(id).then(res => {
        let columns = context.data["organizations"];
        columns = columns.filter((item, index) => index !== idx);
        context.setData({
          organizations: [...columns]
        });
      });
    },
    // 编辑栏目
    editColumn(e) {
      const id = e.target.dataset.id;
      //跳转到简介添加|编辑页面
      wx.navigateTo({
        url: `../groupAddColumOrgHonor/groupAddColumOrgHonor?type=org&id=${id}`
      });
    },
    // 获取栏目列表
    getColumns() {
      return new Promise((resolve, reject) => {
        const tid = wx.getStorageSync("tid");
        OrgService.getColumns(tid).then(data => {
          context.setData({
            organizations: data || []
          });
          resolve();
        });
      });
    },
    // 新增item
    addItem(e) {
      const sid = e.currentTarget.dataset.sid;
      wx.navigateTo({
        url: `../groupAddItemOrg/groupAddItemOrg?sid=${sid}`
      });
    },
    // 删除item
    deleteItem(e) {
      const { sid, id, columnidx, idx } = e.target.dataset;
      OrgService.deleteItem(sid, id).then(() => {
        let columns = context.data["organizations"];
        let column = columns[columnidx];
        column.content.splice(idx, 1);
        context.setData({
          organizations: [...columns]
        });
      });
    },
    // 编辑item
    editItem(e) {
      const { sid, id } = e.target.dataset;
      wx.navigateTo({
        url: `../groupAddItemOrg/groupAddItemOrg?sid=${sid}&id=${id}`
      });
    },
    // 查看item详情
    itemDetail(e) {
      const { sid, id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../groupDetailOrg/groupDetailOrg?sid=${sid}&id=${id}`
      });
    }
  };
}
