import { request } from "@/utils/service"
import type * as Login from "./types/login"
import { s } from "vitest/dist/reporters-1evA5lom.js"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}

export function authenticate(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/authenticate",
    method: "post",
    data
  })
}
