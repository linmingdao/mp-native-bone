export const HOST = 'https://fufusin.com';
export const PREFIX = 'api/v1';

/******************************************** 登录 ********************************************/

// 登录
export const LOGIN = `${HOST}/${PREFIX}/member/login`;
// 登录成功后获取用户详情接口
export const PROFILE = `${HOST}/${PREFIX}/member/profile`;
export const UNIONID = `${HOST}/${PREFIX}/wx/user/unionid`;

/******************************************** 轮播图 ********************************************/

// 获取轮播图列表
export const GET_CAROUSELFIGURE_LIST = `${HOST}/${PREFIX}/team/carouselfigure/gets`;
// 创建轮播图
export const CREAT_CAROUSELFIGURE = `${HOST}/${PREFIX}/team/carouselfigure/create`;
// 上传图片
export const UPLOAD_PHOTO = `${HOST}/${PREFIX}/m/photo/upload`;
// 删除轮播图
export const DELETE_CAROUSELFIGURE = `${HOST}/${PREFIX}/team/carouselfigure/delete`;

/******************************************** 要事 ********************************************/

// 获取推荐列表
export const GET_HOT_LIST = `${HOST}/${PREFIX}/recommend/gets`;
// 获取要事列表
export const GET_EVENT_LIST = `${HOST}/${PREFIX}/team/event/gets`;
// 创建要事
export const CREATE_EVENT = `${HOST}/${PREFIX}/team/event/create`;
// 删除要事
export const DELETE_EVENT = `${HOST}/${PREFIX}/team/event/delete`;
// 更新要事
export const UPDATE_EVENT = `${HOST}/${PREFIX}/team/event/update`;
// 获取要事详情
export const GET_HOT_DETAILS = `${HOST}/${PREFIX}/recommend/get`;
// 获取要事详情
export const GET_EVENT_DETAILS = `${HOST}/${PREFIX}/team/event/get`;
// 转发要事
export const FORWARD_EVENT = `${HOST}/${PREFIX}/message/forward`;

/******************************************** 动态 ********************************************/

// 获取动态列表
export const GET_DYNAMIC_LIST = `${HOST}/${PREFIX}/team/dynamic/gets`;
// 创建动态
export const CREATE_DYNAMIC = `${HOST}/${PREFIX}/team/dynamic/create`;
// 删除动态
export const DELETE_DYNAMIC = `${HOST}/${PREFIX}/team/dynamic/delete`;
// 更新动态
export const UPDATE_DYNAMIC = `${HOST}/${PREFIX}/team/dynamic/update`;
// 获取动态详情
export const GET_DYNAMIC_DETAILS = `${HOST}/${PREFIX}/team/dynamic/get`;

/******************************************** 团队 ********************************************/

// 获取成员信息
export const MEMBER_INFO = `${HOST}/${PREFIX}/member/get`;
// 更新成员信息
export const UPDATE_MEMBER = `${HOST}/${PREFIX}/member/update`;
// 创建团队
export const CREATE_TEAM = `${HOST}/${PREFIX}/team/create`;
// 修改团队
export const UPDATE_TEAM = `${HOST}/${PREFIX}/team/update`;
// 加入团队
export const JOIN_TEAM = `${HOST}/${PREFIX}/team/join`;
// 搜索团队接口
export const SEARCH_TEAM = `${HOST}/${PREFIX}/team/search`;
// 设置默认团队
export const SET_DEFAULT_TEAM = `${HOST}/${PREFIX}/member/default/team/set`;
// 获取团队列表
export const TEAM_LIST = `${HOST}/${PREFIX}/team/list`;
// 获取团队二维码
export const TEAM_QR_CODE = `${HOST}/${PREFIX}/team/code/get`;
// 获取团队信息
export const TEAM_INFO = `${HOST}/${PREFIX}/team/get`;

/******************************************** 通讯录 ********************************************/

// 获取团队通讯录
export const GET_CONTACT = `${HOST}/${PREFIX}/contact/gets/all`;
// 申请加入某团队的通讯录
export const JOIN_CONTACT = `${HOST}/${PREFIX}/contact/join`;
// 通讯录审核操作 status 1 通过， 2 不通过
export const AUDIT_CONTACT = `${HOST}/${PREFIX}/contact/update`;
// 删除通讯录关系
export const DELETE_CONTACT = `${HOST}/${PREFIX}/contact/delete`;
// 获取团队成员列表
export const GET_TEM_MEMBER = `${HOST}/${PREFIX}/team/member/gets`;
// 删除成员
export const DELETE_MEMBER = `${HOST}/${PREFIX}/member/del`;
// 审核成员
export const AUDIT_MEMBER = `${HOST}/${PREFIX}/member/join`;

/******************************************** 简介 ********************************************/

// 创建简介
export const CREATE_INTRO = `${HOST}/${PREFIX}/team/intro/create`;
// 删除简介
export const DELETE_INTRO = `${HOST}/${PREFIX}/team/intro/delete`;
// 更新简介
export const UPDATE_INTRO = `${HOST}/${PREFIX}/team/intro/update`;
// 获取简介详情
export const GET_INTRO = `${HOST}/${PREFIX}/team/intro/get`;
// 获取简介列表
export const GET_INTRO_LIST = `${HOST}/${PREFIX}/team/intro/gets`;

/******************************************** 组织架构 ********************************************/

// 创建组织栏目
export const CREATE_STRUCTURE = `${HOST}/${PREFIX}/team/structure/create`;
// 删除组织栏目
export const DELETE_STRUCTURE = `${HOST}/${PREFIX}/team/structure/delete`;
// 更新组织栏目
export const UPDATE_STRUCTURE = `${HOST}/${PREFIX}/team/structure/update`;
// 获取组织栏目详情
export const GET_STRUCTURE_DETAIL = `${HOST}/${PREFIX}/team/structure/get`;
// 获取组织栏目列表
export const GET_STRUCTURE_LIST = `${HOST}/${PREFIX}/team/structure/gets`;
// 创建组织item
export const CREATE_STRUCTURE_ITEM = `${HOST}/${PREFIX}/team/structure/item/create`;
// 删除组织item
export const DELETE_STRUCTURE_ITEM = `${HOST}/${PREFIX}/team/structure/item/delete`;
// 更新组织item
export const UPDATE_STRUCTURE_ITEM_DETAIL = `${HOST}/${PREFIX}/team/structure/item/update`;
// 获取组织item的详情
export const GET_STRUCTURE_ITEM_DETAIL = `${HOST}/${PREFIX}/team/structure/item/get`;

/******************************************** 荣誉 ********************************************/

// 创建荣誉栏目
export const CREATE_HONOR = `${HOST}/${PREFIX}/team/honor/create`;
// 删除荣誉栏目
export const DELETE_HONOR = `${HOST}/${PREFIX}/team/honor/delete`;
// 更新荣誉栏目
export const UPDATE_HONOR = `${HOST}/${PREFIX}/team/honor/update`;
// 获取荣誉栏目详情
export const GET_HONOR_DETAIL = `${HOST}/${PREFIX}/team/honor/get`;
// 获取荣誉栏目列表
export const GET_HONOR_LIST = `${HOST}/${PREFIX}/team/honor/gets`;
// 创建荣誉item
export const CREATE_HONOR_ITEM = `${HOST}/${PREFIX}/team/honor/item/create`;
// 删除组织item
export const DELETE_HONOR_ITEM = `${HOST}/${PREFIX}/team/honor/item/delete`;
// 更新荣誉item
export const UPDATE_HONOR_ITEM_DETAIL = `${HOST}/${PREFIX}/team/honor/item/update`;
// 获取荣誉item的详情
export const GET_HONOR_ITEM_DETAIL = `${HOST}/${PREFIX}/team/honor/item/get`;

/******************************************** 我的消息 ********************************************/

// 获取我的消息列表
export const GET_MESSAFE_LIST = `${HOST}/${PREFIX}/member/message`;

// 获取栏目公开权限
export const GET_COLUMN_AUTH = `${HOST}/${PREFIX}/auth/column/auth/gets`;

// 设置栏目公开权限
export const UPDATE_COLUMN_AUTH = `${HOST}/${PREFIX}/auth/column/auth/update`;

/******************************************** 我的发布 ********************************************/

// 分页获取我的发布列表
export const GET_MY_PUBLISH_LIST = `${HOST}/${PREFIX}/member/publish/gets`;

// 删除要事/动态的图片接口
export const DELETE_EVENT_DYNAMIC_IMAGE = `${HOST}/${PREFIX}/m/photo/delete`;

// 删除图片接口
export const DELETE_IMAGE = `${HOST}/${PREFIX}/m/photo/delete`;

/******************************************** 权限设置 ********************************************/

// 获取权限信息的用户列表
export const GET_PERMISSION_MEMBER_LIST = `${HOST}/${PREFIX}/member/gets`;

// 设置管理员
export const SET_MEMBER_TO_ADMIN = `${HOST}/${PREFIX}/auth/team/admin/set`;

/******************************************** 评论功能 ********************************************/

//发表评论
export const COMMENT = `${HOST}/${PREFIX}/comment/create`;

// 获取评论列表
export const GETS_COMMENT = `${HOST}/${PREFIX}/comment/gets`;

// 删除评论
export const DELETE_COMMENT = `${HOST}/${PREFIX}/comment/delete`;