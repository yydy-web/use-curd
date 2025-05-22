import type { Ref } from 'vue'
import type { BusinessConf, IUseSeachOptions } from '@yy-web/use-provide'
import { inject, onMounted, ref } from 'vue'
import { businessKey } from '@yy-web/use-provide'

export function useSearch<T = object>(options: IUseSeachOptions<T>) {
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

export type UseSearchReturn<T> = ReturnType<typeof useSearch<T>>