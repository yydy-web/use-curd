import { createContext } from 'react'
import type { BusinessConf } from '@yy-web/use-provide'

export const BusinessContext = createContext<BusinessConf>({
  table: {
    pageKey: 'current',
    sizeKey: 'size',
    listKey: 'records',
    totalKey: 'total',
    initLimit: 10,
    pageOffset: 0,
  },
  successTip: undefined,
})
