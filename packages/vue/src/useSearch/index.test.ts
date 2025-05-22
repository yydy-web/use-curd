import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount, useSetup } from '../.test'
import { useSearch } from './index'

const TestComponent = defineComponent({
  setup(props, { expose }) {
    const { searchFlag } = useSearch({})
    expose({ searchFlag })
    return { searchFlag }
  },
})

describe('use-search', () => {
  it('options firstLoad', async () => {
    const wrapper = mount(TestComponent)

    await nextTick()
    expect(wrapper.searchFlag).toBe(1)
  })

  it('options close firstLoad', () => {
    const { searchFlag } = useSearch({ firstLoad: false })
    expect(searchFlag.value).toBe(0)
  })

  it('options initSearch', () => {
    const vm = useSetup(() => {
      const { searchForm, cacheSearch } = useSearch({
        initSearch: () => ({ name: 'test' }),
      })
      return { searchForm, cacheSearch }
    })
    expect(vm.searchForm).toEqual({ name: 'test' })
    expect(vm.cacheSearch).toEqual({ name: 'test' })
  })

  it('options change searchform', async () => {
    const vm = useSetup(() => {
      const { searchForm, cacheSearch } = useSearch({
        initSearch: () => ({ name: 'test' }),
      })

      nextTick(() => {
        searchForm.value.name = 'test2'
      })
      return { searchForm, cacheSearch }
    })

    await nextTick()
    await expect(vm.searchForm).toEqual({ name: 'test2' })
    await expect(vm.cacheSearch).toEqual({ name: 'test' })
  })

  it('options click reset', async () => {
    const vm = useSetup(() => {
      const search = useSearch({
        initSearch: () => ({ name: 'test' }),
      })

      nextTick(() => {
        search.searchForm.value.name = 'test2'
      })
      return search
    })

    await nextTick()
    await vm.resetPage()
    await nextTick()
    await expect(vm.searchForm).toEqual({ name: 'test' })
    await expect(vm.cacheSearch).toEqual({ name: 'test' })
  })

  it('options search fn', async () => {
    const searchFn = vi.fn(params => params)
    useSetup(() => {
      const search = useSearch({
        initSearch: () => ({ name: 'test' }),
        handleSearch: searchFn,
      })
      return search
    })

    await nextTick()
    expect(searchFn).toHaveBeenCalledWith({ name: 'test' })
  })

  it('options search fn2', async () => {
    const searchFn = vi.fn(params => params)
    const vm = useSetup(() => {
      const search = useSearch<{ name: string, tel: string }>({
        initSearch: () => ({ name: 'test' }),
        handleSearch: searchFn,
      })

      nextTick(() => {
        search.searchForm.value.tel = 'test2'
      })

      return search
    })

    await nextTick()
    await vm.searchPage()
    expect(searchFn).toHaveBeenCalledWith({ name: 'test', tel: 'test2' })
  })
})
