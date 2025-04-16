export interface Brand {
  id: string
  brandName: string
  originYear: string
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
  brandName?: string
  originYear?: string
  startDate?: string
  endDate?: string
}

export interface CreateOrUpdateBrandRequestData {
  id?: string
  brandName: string
  originYear: string
  comment?: string
}

export interface batchDeleteTableRequestData {
  brandIds: string[]
}

export interface GetTableData {
  id: string
  brandName: string
  originYear: string
  comment: string
  createTime: string
  modifiedTime: string | null
  isLock: any
}
