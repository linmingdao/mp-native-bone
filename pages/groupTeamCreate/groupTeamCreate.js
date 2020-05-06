import * as groupService from "../../services/handlers/group/group.js";
import { wxNavigateBack } from "../../services/services-mixin.js";

Page({
  data: {
    isPending: false,
    multiArray: [
      [
        "互联网/信息行业",
        "制造行业",
        "贸易/物流",
        "交通运输",
        "建筑房地产",
        "金融行业",
        "服务业",
        "政府/事业单位",
        "教育行业",
        "文化传媒行业",
        "企业服务",
        "医疗医药",
        "亲朋好友",
        "社会组织",
        "党组织"
      ],
      [
        "电信运营",
        "计算机软件",
        "计算机硬件",
        "IT服务",
        "互联网",
        "电子商务",
        "游戏"
      ]
    ],
    multiIndex: [0, 0],
    region: ["广东省", "广州市", "海珠区"],
    customItem: "请选择",
    // 团队logo
    team_logo: {
      name: "team_logo",
      type: "team",
      path: "",
      file: {}
    },
    formData: {
      name: "", // 团队名称
      industry: "互联网/信息行业,电信运营", // 行业分类
      province: "广东省", // 省份
      city: "广州市", // 城市
      area: "海珠区", // 区
      addr: "", // 详细地址
      creator_name: "" // 创建者姓名
    },
    rules: [
      {
        name: "name",
        rules: { required: true, message: "团队名称必填" }
      },
      {
        name: "industry",
        rules: [{ required: true, message: "行业分类必选" }]
      },
      {
        name: "province",
        rules: [{ required: true, message: "省份必选" }]
      },
      {
        name: "city",
        rules: [{ required: true, message: "城市必选" }]
      },
      {
        name: "area",
        rules: [{ required: true, message: "地区必选" }]
      },
      {
        name: "addr",
        rules: [{ required: true, message: "地址必填" }]
      },
      {
        name: "creator_name",
        rules: [{ required: true, message: "创建者姓名必填" }]
      }
    ]
  },
  chooseImage(e) {
    const { field } = e.target.dataset;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const tempFilePaths = res.tempFilePaths;
        const tempFiles = res.tempFiles;
        this.setData({
          [field]: {
            name: field,
            type: "team",
            path: tempFilePaths[0],
            file: tempFiles[0]
          }
        });
      }
    });
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  bindRegionChange: function(e) {
    const region = e.detail.value;
    this.setData({
      region: region,
      "formData.province": region[0] || "",
      "formData.city": region[1] || "",
      "formData.area": region[2] || ""
    });
  },
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [
              "电信运营",
              "计算机软件",
              "计算机硬件",
              "IT服务",
              "互联网",
              "电子商务",
              "游戏"
            ];
            break;
          case 1:
            data.multiArray[1] = [
              "日用品化妆",
              "食品饮料",
              "服装纺织",
              "家电数码",
              "糖酒烟草",
              "办公家具",
              "通信电子计算机",
              "文教体",
              "矿业能源化工",
              "机械加工"
            ];
            break;
          case 2:
            data.multiArray[1] = [
              "商店超市",
              "批发零售",
              "物流仓储",
              "进出口",
              "邮政"
            ];
            break;
          case 3:
            data.multiArray[1] = [
              "航空交通",
              "道路交通",
              "铁路交通",
              "船舶水运"
            ];
            break;
          case 4:
            data.multiArray[1] = [
              "建筑设计",
              "土木工程",
              "房地产",
              "物业管理",
              "建材",
              "装饰装修",
              "业委会"
            ];
            break;
          case 5:
            data.multiArray[1] = ["银行", "投资", "保险", "证券", "基金信托"];
            break;
          case 6:
            data.multiArray[1] = [
              "酒店",
              "餐饮",
              "旅游",
              "休闲娱乐",
              "家政中介",
              "租赁",
              "安全安防",
              "咨询"
            ];
            break;
          case 7:
            data.multiArray[1] = [
              "民政",
              "公检法",
              "交通",
              "市政",
              "工商税务",
              "公共事业",
              "研究院/所",
              "税务",
              "村镇"
            ];
            break;
          case 8:
            data.multiArray[1] = [
              "高校高职",
              "中小学",
              "培训机构",
              "职业教育",
              "幼教",
              "班级",
              "学生会",
              "校友会"
            ];
            break;
          case 9:
            data.multiArray[1] = [
              "广告公关",
              "报纸杂志",
              "广播影视娱乐",
              "出版展览",
              "艺术工艺",
              "体育健身",
              "动漫电竞"
            ];
            break;
          case 10:
            data.multiArray[1] = [
              "会计审计",
              "外包人力",
              "管理咨询代办",
              "法律",
              "检测认证",
              "翻译",
              "知识产权"
            ];
            break;
          case 11:
            data.multiArray[1] = [
              "医院",
              "医疗器械",
              "健康管理",
              "药店",
              "药厂"
            ];
            break;
          case 12:
            data.multiArray[1] = ["家庭", "同学", "朋友", "家族"];
            break;
          case 13:
            data.multiArray[1] = [
              "公益",
              "商会",
              "宗教",
              "环境",
              "农林渔牧",
              "社团",
              "合作社",
              "民主党派",
              "国际"
            ];
            break;
          case 14:
            data.multiArray[1] = ["党群", "党委", "团委"];
            break;
        }
        break;
    }
    this.setData({
      ...data,
      "formData.industry": `${data.multiArray[0][data.multiIndex[0]]},${
        data.multiArray[1][data.multiIndex[1]]
      }`
    });
  },
  submitForm() {
    this.selectComponent("#form").validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({ error: errors[firstError[0]].message });
        }
      } else {
        if (this.data["team_logo"].path !== "") {
          this.setData({ isPending: true });
          // 创建团队
          groupService
            .createTeam(
              {
                ...this.data.formData,
                mid: wx.getStorageSync("mid")
              },
              [this.data["team_logo"]]
            )
            .then(() => {
              wx.showModal({
                title: "提示",
                showCancel: false,
                content: "团队创建申请已提交审核，请耐心等待审核结果",
                success: () => {
                  wxNavigateBack();
                }
              });
            })
            .catch(err => {
              console.error(err);
            })
            .finally(() => this.setData({ isPending: false }));
        } else {
          this.setData({ error: "还没上传团队logo哟" });
        }
      }
    });
  }
});
