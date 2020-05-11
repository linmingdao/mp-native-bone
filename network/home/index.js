// import httpClient from "../httpClient.js";
// import * as API from "../../constants/api.js";
import { Promise } from "../../supports/promise.js";

/**
 * 获取商品分类列表数据
 */
export function getCategoryData() {
  // return httpClient.get(API.CATEGORY);
  // httpClient.get("https://www.baidu.com/").then((response) => {
  //   console.log(response);
  // });
  // 模拟网络请求
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          cate_id: 1,
          cate_name: "洗护",
          children: [
            {
              child_id: 1,
              name: "洁面皂uu",
              image: "../../assets/images/home/1.jpg",
            },
            {
              child_id: 2,
              name: "卸妆",
              image: "../../assets/images/home/2.jpg",
            },
          ],
        },
        {
          cate_id: 2,
          cate_name: "生鲜",
        },
        {
          cate_id: 3,
          cate_name: "食品",
        },
        {
          cate_id: 4,
          cate_name: "女装",
        },
        {
          cate_id: 5,
          cate_name: "百货",
        },
        {
          cate_id: 6,
          cate_name: "母婴",
        },
        {
          cate_id: 7,
          cate_name: "手机",
        },
        {
          cate_id: 8,
          cate_name: "鞋靴",
        },
        {
          cate_id: 9,
          cate_name: "运动",
        },
        {
          cate_id: 10,
          cate_name: "美家",
        },
        {
          cate_id: 11,
          cate_name: "男装",
        },
        {
          cate_id: 12,
          cate_name: "水果",
        },
        {
          cate_id: 13,
          cate_name: "电子",
        },
      ]);
    }, 1000);
  });
}
