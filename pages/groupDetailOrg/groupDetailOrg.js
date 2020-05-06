import * as OrgService from '../../services/handlers/group/org';
import * as CommonService from '../../services/handlers/common';

Page({
  data: {
    photo: {},
    name: '',
    age: '',
    nation: '',
    education: '',
    job_title: '',
    job: '',
    phone: '',
    intro: ''
  },
  onLoad: function (options) {
    const { sid, id } = options;
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
      });
    });
  }
})