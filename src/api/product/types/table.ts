export interface Product {
  id: string
  brandTypeId: number
  productName: string
  specification: string
  manufactureDate: string
  hasSpecificDay: any
  retailPrice: number
  sellPrice: number
  unitType: number
  currentQuantity: number
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
  productName?: string
  startDate?: string
  endDate?: string
}

export interface CreateOrUpdateProductRequestData {
  id?: string
  brandTypeId: number
  productName: string
  specification: string
  manufactureDate: string
  hasSpecificDay?: string
  retailPrice: number
  sellPrice?: number
  unitType: number
  currentQuantity: number
  comment?: string
}

export interface GetTableData {
  id: string
  productName: string
  specification: string
  manufactureDate: string
  hasSpecificDay: any
  retailPrice: number
  sellPrice: number
  unitType: number
  currentQuantity: number
  comment: string
  createTime: string
  modifiedTime: string | null
  isLock: any
}

export interface batchDeleteTableRequestData {
  productIds: string[]
}
