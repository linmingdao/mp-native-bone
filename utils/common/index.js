/**
 * 格式化时间
 * @param {Date} date
 * @param {String} fmt
 */
export const formatDate = (date, fmt = "yyyy年MM月dd日 hh:mm:ss") => {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );

  return fmt;
};

/**
 * 防抖处理函数
 * @param func
 * @param wait
 * @param immediate
 * @returns {deBounceDecorator}
 */
export const deBounce = (func, wait, immediate) => {
  let timeout, result;
  let deBounceDecorator = function () {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }

    return result;
  };

  deBounceDecorator.cancel = function () {
    clearTimeout(deBounceDecorator);
    timeout = null;
  };

  return deBounceDecorator;
};
