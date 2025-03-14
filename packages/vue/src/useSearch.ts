import type { Ref } from 'vue'
import type { BusinessConf } from './provice'
import { inject, onMounted, ref } from 'vue'
import { businessKey } from './provice'

export interface IUseSeachOptions<T> {
  initSearch?: () => Partial<T>
  beforeSearch?: (params?: T) => { [key: string]: unknown }
  handleSearch?: (params?: T) => void
  handleReset?: () => void
  beforeExport?: () => void
  afterExport?: () => void
  firstLoad?: boolean
}

export interface UseSearchReturn<T> {
  searchFlag: Ref<number>
  searchForm: Ref<Partial<T>>
  cacheSearch: Ref<Partial<T>>
  searchParams: () => T
  searchPage: () => void
  resetPage: () => void
  confirmSearch: (content: string, callback: () => PromiseLike<void>, cancelFn?: () => PromiseLike<void>) => void
}

export function useSearch<T = object>(options: IUseSeachOptions<T>): UseSearchReturn<T> {
  const {
    initSearch = () => ({} as Partial<T>),
    beforeSearch = () => ({}),
    handleSearch,
    handleReset = () => ({}),
    firstLoad = true,
  } = options

  const searchFlag = ref<number>(0)
  const searchForm = ref<Partial<T>>({})
  const cacheSearch = ref<Partial<T>>({})

  const { confirmTip, resetType } = inject(businessKey, {
    confirmTip: undefined,
    resetType: undefined,
  } as BusinessConf)

  onMounted(() => {
    firstLoad && searchPage()
  })

  function searchParams(): T {
    const params = cacheSearch.value as T
    return { ...params, ...beforeSearch(params) }
  }

  function confirmSearch(content: string, callback: () => PromiseLike<void>, cancelFn?: () => PromiseLike<void>): void {
    confirmTip && confirmTip(content, callback, cancelFn)
  }

  function searchPage(): void {
    searchFlag.value++
    const initForm = initSearch()
    const cacheSearchParams = Object.assign({}, initForm, searchForm.value)
    cacheSearch.value = JSON.parse(JSON.stringify(cacheSearchParams))
    handleSearch && handleSearch(searchParams())
  }

  function resetPage(): void {
    handleReset()
    ;(Object.entries(searchForm.value || {}).map(([k, v]) => [k, Array.isArray(v) ? [] : resetType]) as [string, any])
      .forEach(([k, v]) => {
        k && ((searchForm.value as Record<string, unknown>)[k] = v)
      })
    searchPage()
  }

  return {
    searchFlag,
    searchForm: searchForm as Ref<Partial<T>>,
    cacheSearch: cacheSearch as Ref<Partial<T>>,
    searchParams,
    searchPage,
    resetPage,
    confirmSearch,
  }
}
