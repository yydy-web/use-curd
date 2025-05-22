import type { App } from 'vue'
import { businessKey } from '@yy-web/use-provide'
import type { BusinessConf } from '@yy-web/use-provide'

export function confBusiness(app: App, config?: BusinessConf) {
  app.provide(businessKey, config)
}
