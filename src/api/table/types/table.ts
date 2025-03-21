export interface CreateOrUpdateTableRequestData {
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

export interface GetTableRequestData {
  /** 当前页码 */
  current: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface GetTableData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
