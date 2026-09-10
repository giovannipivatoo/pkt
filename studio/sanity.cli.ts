import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '85609dop',
    dataset: 'production'
  },
  deployment: {
    appId: 'x8q37mf59lycd14al06t6c6p',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
