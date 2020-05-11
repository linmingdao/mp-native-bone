/**
 * 判断是否是函数
 * @param {*} fn
 */
export const isFunction = (fn) => typeof fn === "function";

/**
 * 判断是否是非空字符串
 * @param {*} obj
 */
export const isNotEmptyString = (obj) =>
  typeof obj === "string" && obj.trim() !== "";

/**
 * 判断是否是非空字符串
 * @param {*} obj
 */
export const isEmptyString = (obj) =>
  typeof obj === "string" && obj.trim() === "";

/**
 * url查询对象转查询字符串(a=1&b=3)
 * @param {object} queryObj
 */
export const convertQueryObjToString = (queryObj = {}) =>
  Object.keys(queryObj)
    .map((key) => `${key}=${object[key]}`)
    .join("&");

/**
 * 将查询参数对象混入url中
 * @param {string} url
 * @param {object} query
 */
export const mergeUrl = (url, query = {}) => {
  const queryStr = convertQueryObjToString(query);
  return queryStr ? `${url}${url.includes("?") ? "&" : "?"}${queryStr}` : url;
};
