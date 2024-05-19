interface Product {
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

interface Pageable {
  pageNumber: number
  pageSize: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  offset: number
  paged: boolean
  unpaged: boolean
}

interface GetTableRequestData {
  current: number
  size: number
  productName?: string
  startDate?: string
  endDate?: string
}

interface TableDataResponse {
  code: number
  msg: string | null
  data: {
    content: Product[]
    pageable: Pageable
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    numberOfElements: number
    first: boolean
    empty: boolean
  }
}
