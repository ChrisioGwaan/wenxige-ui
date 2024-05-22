import { request } from "@/utils/service"
import { batchDeleteTableRequestData } from "@/api/brand-type/types/table"

export function getTableDataPage(params: any) {
  return request({
    url: `brandType/page`,
    method: "get",
    params
  })
}

export function createBrandType(data: any) {
  return request({
    url: `brandType/create`,
    method: "post",
    data
  })
}

export function updateBrandType(data: any) {
  return request({
    url: `brandType/update`,
    method: "put",
    data
  })
}

export function deleteBrandType(id: string) {
  return request({
    url: `brandType/${id}`,
    method: "delete"
  })
}

export function getBrandTypeById(id: string) {
  return request({
    url: `brandType/${id}`,
    method: "get"
  })
}

export function batchDeleteBrandType(data: batchDeleteTableRequestData) {
  return request({
    url: `brandType/batchDelete`,
    method: "delete",
    data: data
  })
}

export function dropDownBrandTypeList(args: string) {
  return request({
    url: `brandType/dropdown`,
    method: "get",
    params: { args: args }
  })
}
