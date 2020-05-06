/**
 * 正整数
 * @param {String} str
 */
export const checkPositiveInteger = str => /^\+?[1-9][0-9]*$/.test(str);

/**
 * 正则表达式判断手机号码格式
 * @param {String} phone
 */
export const checkPhone = phone => /^1[34578]\d{9}$/.test(phone);

/**
 * 正则表达式判断邮箱格式
 * @param {String} email
 */
export const checkEmail = email => /^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email);

/**
 * 正则表达式判断身份证格式
 * @param {String} idcard
 */
export const checkIDCard = idcard => /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idcard);