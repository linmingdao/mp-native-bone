
import * as OrgService from '../../services/handlers/group/org';
import * as Constants from '../../supports/constants';
import * as Validator from '../../supports/validator';
import * as CommonService from '../../services/handlers/common';
import {
  showToast,
  wxNavigateBack
} from '../../services/services-mixin.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid: '', // 组织栏目id
    id: '', // 组织栏目item id
    photo: null, // 免冠照
    name: '', // 名字
    age: '', // 年龄
    nation: '', // 民族
    education: '', // 学历
    job: '', // 职务
    phone: '', // 电话
    intro: '', // 简介
  },
  chooseImage: function (e) {
    const __this = this;
    const contenttype = e.target.dataset.contenttype;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        const tempFiles = res.tempFiles
        __this.setData({
          [contenttype]: {
            name: 'photo',
            type: 'structure',
            path: tempFilePaths[0],
            file: tempFiles[0]
          }
        })
      }
    });
  },
  bindUserInput: function (e) {
    const contenttype = e.target.dataset.contenttype;
    const value = e.detail.value;
    this.setData({
      [contenttype]: value
    });
  },
  save: function () {
    const formData = {
      name: this.data['name'],
      age: this.data['age'],
      nation: this.data['nation'],
      education: this.data['education'],
      job_title: this.data['job_title'],
      job: this.data['job'],
      phone: this.data['phone'],
      intro: this.data['intro']
    };

    // 校验表单数据
    if (formData.name.trim() === '' ||
      formData.age.trim() === '' ||
      formData.nation.trim() === '' ||
      formData.education.trim() === '' ||
      formData.job.trim() === '' ||
      formData['job_title'].trim() === '' ||
      formData.phone.trim() === '' ||
      formData.intro.trim() === '') {
      showToast(Constants.NOT_FILLED);
      return;
    }

    const photo = this.data.photo;
    if (!photo) {
      showToast(Constants.NOT_FILLED);
    }

    if (this.data['id']) {
      // 更新
      OrgService.updateItem(this.data['sid'], this.data['id'], formData, photo).then(data => {
        wx.showToast({
          icon: 'success',
          duration: 2000
        });
        setTimeout(wxNavigateBack, 2000);
      });
    } else {
      formData.id = this.data['sid'];
      // 创建
      OrgService.createItem(formData, photo).then(data => {
        wx.showToast({
          icon: 'success',
          duration: 2000
        });
        setTimeout(wxNavigateBack, 2000);
      }).catch(err => {
        console.error(err);
      });
    }
  },
  onLoad: function (options) {
    const sid = options['sid'];
    const id = options['id'];
    wx.setNavigationBarTitle({
      title: id ? '编辑组织信息' : '新增组织信息'
    });
    this.setData({ sid });
    if (id) {
      this.setData({ id });
      OrgService.getItemDetail(sid, id).then(data => {
        this.setData({
          photo: {
            path: `${CommonService.getHost()}/${data.photo}`,
            from: 'api'
          },
          name: data['name'],
          age: data['age'],
          nation: data['nation'],
          education: data['education'],
          job_title: data['job_title'],
          job: data['job'],
          phone: data['phone'],
          intro: data['intro']
        })
      });
    }
  }
})