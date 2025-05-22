import type { BusinessConf, IUseTableOptions, IPageConf } from '@yy-web/use-provide'
import { useToggle } from '@vueuse/core'
import { inject, ref, watch } from 'vue'
import { businessKey } from '@yy-web/use-provide'
import { useSearch } from './use-search'

export function useTable<Search extends object = object, Data extends object = object>(options: IUseTableOptions<Search, Data>) {
  const {
    apiAction,
    firstLoad = true,
    pagination = true,
    delAction = undefined,
    initSearch = () => ({} as Partial<Search>),
    beforeSearch = () => ({}),
    afterSearch = () => ({}),
    limitSize = 0,
  } = options

  const { table, successTip } = inject(businessKey, {
    table: {},
    successTip: undefined,
  } as BusinessConf)

  const { listKey, totalKey, pageKey, sizeKey, initLimit, pageOffset } = {
    pageKey: 'current',
    sizeKey: 'size',
    listKey: 'records',
    totalKey: 'total',
    initLimit: 10,
    pageOffset: 0,
    ...table,
  }

  const dataSource = ref<Data[]>([])
  const pageConf = ref<IPageConf>({
    total: 0,
    current: 1,
    limit: limitSize || initLimit,
  })

  const {
    searchForm,
    cacheSearch,
    searchFlag,
    confirmSearch,
    resetPage,
    searchPage,
    searchParams,
  } = useSearch<Search>({
    firstLoad,
    initSearch,
    beforeSearch,
    handleSearch() {
      if (pageConf.value.current !== 1) {
        pageConf.value.current = 1
        return
      }
      getTable()
    },
    handleReset() {
      dataSource.value = []
    },
  })

  const [loading, toggleLoading] = useToggle()
  watch(() => pageConf.value.current, getTable)
  watch(() => pageConf.value.limit, searchPage)

  function getTable(): void {
    const params = {
      [pageKey as string]: pageConf.value.current - pageOffset,
      [sizeKey as string]: pageConf.value.limit,
      ...searchParams(),
    }
    toggleLoading(true)
    apiAction(params).then((result) => {
      const { records, total } = !pagination && Array.isArray(result)
        ? { records: result as Data[], total: (result as Data[]).length }
        : { records: (result as { [key: string]: Data[] })[listKey!], total: (result as { [key: string]: number })[totalKey!] || 0 }
      dataSource.value = records
      pageConf.value.total = total
      afterSearch(records)
    }).finally(() => {
      toggleLoading(false)
    })
  }

  function delDataRow(id: string | number, content = '是否删除？'): void {
    confirmSearch(content, async () => {
      if (typeof delAction === 'undefined')
        throw new Error('error config del action')

      return delAction(id)
        .then(() => {
          successTip && successTip('删除成功！')
          if (dataSource.value.length === 1 && pageConf.value.current !== 1) {
            pageConf.value.current--
            return
          }
          getTable()
        })
    })
  }

  return {
    loading,
    searchForm,
    dataSource,
    searchFlag,
    cacheSearch,
    pageConf,
    delDataRow,
    getTable,
    confirmSearch,
    resetTable: resetPage,
    searchTable: searchPage,
  }
}

export type UseTableReturn<Search extends object, Data extends object = object> = ReturnType<typeof useTable<Search, Data>>