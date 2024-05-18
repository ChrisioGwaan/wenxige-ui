import { request } from "@/utils/service"
import type * as productInfo from "./types/table"

export function getTableDataPage(params: productInfo.GetTableRequestData) {
  return request<productInfo.GetTableResponseData>({
    url: `product/page`,
    method: "get",
    params
  })
}
