export const businessKey = Symbol('yy-business')

export interface TableConf {
  pageKey?: string
  sizeKey?: string
  listKey?: string
  totalKey?: string
  initLimit?: number
  pageOffset?: number
}

export interface BusinessConf {
  table?: TableConf
  confirmTip?: (content: string, successCb: () => PromiseLike<void>, cancelCb?: () => PromiseLike<void>) => void
  successTip?: (content: string) => void
  resetType?: string | number | null
}

export interface IUseSeachOptions<T> {
  initSearch?: () => Partial<T>
  beforeSearch?: (params?: T) => { [key: string]: unknown }
  handleSearch?: (params?: T) => void
  handleReset?: () => void
  beforeExport?: () => void
  afterExport?: () => void
  firstLoad?: boolean
}

export interface IUseTableOptions<Search extends object, Data extends object> extends IUseSeachOptions<Search> {
  apiAction: (data: Search & Pick<TableConf, 'pageKey' | 'sizeKey'>) => Promise<unknown[] | { [key: string]: unknown }>
  pagination?: boolean
  delAction?: (id: string | number) => Promise<boolean>
  afterSearch?: (result: Data[]) => void
  limitSize?: number
}

export interface IResponseTable<Data> {
  records: Data[]
  total: number
}

export interface IPageConf {
  total: number
  current: number
  limit: number
}