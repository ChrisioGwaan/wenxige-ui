export interface BrandType {
  id: string
  brandId: string
  brandTypeName: string
  comment: string
  createUser: string
  modifiedUser: string | null
  createTime: string
  modifiedTime: string | null
  isLock: any
  isDel: string
}

export interface GetTableRequestData {
  current: number
  size: number
  brandTypeName?: string
  startDate?: string
  endDate?: string
}

export interface CreateOrUpdateBrandTypeRequestData {
  id?: string
  brandId: string
  brandName: string
  brandTypeName: string
  comment?: string
}

export interface batchDeleteTableRequestData {
  brandTypeIds: string[]
}

export interface GetTableData {
  id: string
  brandTypeName: string
  comment: string
  createTime: string
  modifiedTime: string | null
  isLock: any
}
