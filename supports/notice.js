import { wxShowModal } from "../wxp.js";

export const alertError = (content) =>
  wxShowModal({ title: "错误", content, showCancel: false });

export const alertWarning = (content) =>
  wxShowModal({ title: "警告", content, showCancel: false });

export const alertInfo = (content) =>
  wxShowModal({ title: "提示", content, showCancel: false });

export const alertSuccess = (content) =>
  wxShowModal({ title: "成功", content, showCancel: false });
