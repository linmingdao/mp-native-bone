import { Promise } from "../../../supports/promise-customized";
import * as ServiceIntro from "../../../services/handlers/group/intro";

export default function(context) {
    return {
        // 展开手风琴
        expand(e) {
            const expandIdx = e.currentTarget.dataset.expandidx;
            if (expandIdx) {
                let [name, idx] = expandIdx.split(":");
                idx = parseInt(idx);
                context.setData({
                    expandIntroIdx: context.data["expandIntroIdx"] !== idx ? idx : -1
                });
            }
        },
        // 添加栏目
        addColumn() {
            //跳转到简介添加|编辑页面
            wx.navigateTo({
                url: "../groupAddColumnIntro/groupAddColumnIntro?type=honor&id="
            });
        },
        // 删除栏目
        deleteColumn(e) {
            const id = e.target.dataset.id;
            const idx = e.target.dataset.idx;
            ServiceIntro.deleteColumn(id).then(res => {
                let columns = context.data["introductions"];
                columns = columns.filter((item, index) => index !== idx);
                context.setData({
                    introductions: [...columns]
                });
            });
        },
        // 编辑栏目
        editColumn(e) {
            const id = e.target.dataset.id;
            //跳转到简介添加|编辑页面
            wx.navigateTo({
                url: `../groupAddColumnIntro/groupAddColumnIntro?type=honor&id=${id}`
            });
        },
        // 获取栏目列表
        getColumns() {
            return new Promise((resolve, reject) => {
                const tid = wx.getStorageSync("tid");
                ServiceIntro.getColumns(tid).then(data => {
                    context.setData({
                        introductions: data.map(item => {
                            return {
                                ...item,
                                content: item.content.split(/\n/).map(content => `<div>${content}</div>`).join('')
                            }
                        })
                    });
                    resolve();
                });
            });
        }
    };
}