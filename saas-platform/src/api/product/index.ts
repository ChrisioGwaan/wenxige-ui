import { request } from "@/utils/service"
import type * as productInfo from "@/api/product/types/table"

export function getTableDataPage(params: productInfo.GetTableRequestData) {
  return request({
    url: `product/page`,
    method: "get",
    params
  })
}

export function createProduct(data: productInfo.CreateOrUpdateProductRequestData) {
  return request({
    url: `product/create`,
    method: "post",
    data
  })
}

export function updateProduct(data: productInfo.CreateOrUpdateProductRequestData) {
  return request({
    url: `product/update`,
    method: "put",
    data
  })
}

export function deleteProduct(id: string) {
  return request({
    url: `product/${id}`,
    method: "delete"
  })
}

export function getProductById(id: string) {
  return request({
    url: `product/${id}`,
    method: "get"
  })
}

export function batchDeleteProduct(data: productInfo.batchDeleteTableRequestData) {
  return request({
    url: `product/batchDelete`,
    method: "delete",
    data: data
  })
}
