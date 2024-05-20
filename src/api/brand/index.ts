import { request } from "@/utils/service"
import * as brandInfo from "@/api/brand/types/table"

export function getTableDataPage(params: brandInfo.GetTableRequestData) {
  return request({
    url: `brand/page`,
    method: "get",
    params
  })
}
export function createBrand(data: brandInfo.CreateOrUpdateBrandRequestData) {
  return request({
    url: `brand/create`,
    method: "post",
    data
  })
}

export function updateBrand(data: brandInfo.CreateOrUpdateBrandRequestData) {
  return request({
    url: `brand/update`,
    method: "put",
    data
  })
}

export function deleteBrand(id: string) {
  return request({
    url: `brand/${id}`,
    method: "delete"
  })
}

export function getBrandById(id: string) {
  return request({
    url: `brand/${id}`,
    method: "get"
  })
}

export function batchDeleteBrand(data: brandInfo.batchDeleteTableRequestData) {
  return request({
    url: `brand/batchDelete`,
    method: "delete",
    data: data
  })
}
