import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElNotification } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"

function logout() {
  useUserStoreHook().logout()
  location.reload()
}

function createService() {
  const service = axios.create()
  service.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  )
  service.interceptors.response.use(
    (response) => {
      const apiData = response.data
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData
      const code = apiData.code
      if (code === undefined) {
        ElMessage.error("API is not developed for this system")
        return Promise.reject(new Error("API is not developed for this system"))
      }
      switch (code) {
        case 0:
          return apiData
        case 1:
          if (apiData.msg === "Token has expired or is invalid") {
            ElNotification({
              title: "Notification",
              message: "Token has expired. Please log in again.",
              type: "warning",
              duration: 0
            })
            return logout()
          }
          return Promise.reject(new Error("Error"))
        case 401:
          // Token expired
          return logout()
        default:
          // Incorrect code
          // ElMessage.error(apiData.message || "Error")
          return Promise.reject(new Error("Error"))
      }
    },
    (error) => {
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "Request Error"
          break
        case 401:
          logout()
          break
        case 403:
          error.message = "Forbidden"
          break
        case 404:
          error.message = "Not Found"
          break
        case 408:
          error.message = "Timeout"
          break
        case 500:
          error.message = "Internal Server Error"
          break
        case 501:
          error.message = "Not Implemented"
          break
        case 502:
          error.message = "Bad Gateway"
          break
        case 503:
          error.message = "Service Unavailable"
          break
        case 504:
          error.message = "Gateway Timeout"
          break
        case 505:
          error.message = "HTTP Version Not Supported"
          break
        default:
          break
      }
      return Promise.reject(error)
    }
  )
  return service
}

function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

const service = createService()
export const request = createRequest(service)
