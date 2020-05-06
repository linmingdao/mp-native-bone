import { Promise } from "../../supports/promise-customized";
import * as OrgService from "../../services/handlers/group/org";
import * as HonorService from "../../services/handlers/group/honor";
import { wxNavigateBack } from "../../services/services-mixin.js";

Page({
    data: {
        isPending: false,
        // 指定是添加组织还是荣誉：org,honor
        type: "",
        // 表单数据
        id: "",
        title: ""
    },
    formInputChange(e) {
        const { field } = e.target.dataset;
        const value = e.detail.value;
        this.setData({
            [field]: value
        });
    },
    save() {
        const { id, type, title } = this.data;
        // 校验必填字段信息
        if (title === "") {
            this.setData({ error: "栏目名称必填哟" });
            return;
        }
        // 校验通过
        new Promise((resolve, reject) => {
                this.setData({ isPending: true });
                if (id) {
                    // 更新栏目信息
                    type === "org" ?
                        OrgService.updateColumn(id, title)
                        .then(() => resolve())
                        .catch(err => reject(err)) :
                        HonorService.updateColumn(id, title)
                        .then(() => resolve())
                        .catch(err => reject(err));
                } else {
                    // 新增栏目
                    const tid = wx.getStorageSync("tid");
                    type === "org" ?
                        OrgService.addColumn(tid, title)
                        .then(() => resolve())
                        .catch(err => reject(err)) :
                        HonorService.addColumn(tid, title)
                        .then(() => resolve())
                        .catch(err => reject(err));
                }
            })
            .then(() => wx.reLaunch({ url: `../group/group?visibleTab=${type==='org'?'organizations':'honors'}` }))
            .catch(err => console.log(err))
            .finally(() => this.setData({ isPending: false }));
    },
    onLoad({ id, type }) {
        this.setData({ id, type });

        // 动态设置title信息
        let title = "";
        if (id) {
            title = type === "org" ? "编辑组织栏目" : "编辑风采栏目";
        } else {
            title = type === "org" ? "新增组织栏目" : "新增风采栏目";
        }
        wx.setNavigationBarTitle({ title });

        // 数据回填
        if (id && type) {
            type === "org" ?
                OrgService.getColumnDetail(id)
                .then(data => this.setData({ title: data.title || "" }))
                .catch(err => console.log(err)) :
                HonorService.getColumnDetail(id)
                .then(data => this.setData({ title: data.title || "" }))
                .catch(err => console.log(err));
        }
    }
});