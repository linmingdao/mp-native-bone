import { Promise } from "./promise-customized";

/**
 * 拦截的网络请求对象发起请求的前后
 * @param {Object} target
 * @param {Function} before
 * @param {Function} after
 * @param {Function} intercepter
 */
export const intercept = (request, before, after, intercepter) => {
  return new Promise((resolve, reject) => {
    before && before();
    request
      .then(response => {
        if (typeof intercepter === "function") {
          !intercepter({
            response,
            statusCode: response.statusCode
          }) && resolve(response);
        } else {
          resolve(response);
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
      .finally(() => after && after());
  });
};
