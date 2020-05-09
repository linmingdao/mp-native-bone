// 拓展一些es6-promise没有的方法
import { Promise } from "../libraries/promise.js";

// 无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};

// 将小程序回调形式的api转成promise形式
const promisify = function (fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = (result) => resolve(result);
      obj.fail = (result) => reject(result);
      fn(obj);
    });
  };
};

// 顺序执行Promise
const runPromiseInSequense = (arr) => {
  return arr.reduce((promiseChain, currentPromise) => {
    return promiseChain.then((chainedResult) => {
      return currentPromise(chainedResult).then((res) => res);
    });
  }, Promise.resolve());
};

export { Promise, promisify, runPromiseInSequense };
