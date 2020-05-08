// 操作成功
export const SUCCESS = 2000;

// token过期，重新登录
export const TOKEN_EXPIRED = 1002;

// 数据处理异常
export const DATA_EXCEPTION = 1005;

// 不可以同时配置all和单语言配置
export const PUSH_LANGUAGE_ERROR = 3000;

// 单语言不可重复配置
export const PUSH_LANGUAGE_DUPLICATE_ERROR = 3001;

// 筛选出的推送人员为空
export const PUSH_USER_NULL_ERROR = 3001;

// 注释编辑：字段编辑错误状态码，此状态码下不进行拦截
export const TABLE_COMMENT_EDIT_ERROR = 9000;

// 同样的日期已配置了相同的势力
export const EXISTS_LEAGUE_ERROR = 3011;
