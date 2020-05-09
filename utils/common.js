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
