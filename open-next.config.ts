import type { OpenNextConfig } from 'open-next/types'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare',
      converter: 'edge',
      incrementalCache: 'cloudflare-kv',
      tagCache: 'cloudflare-kv',
      queue: 'sqs',
    },
  },
}

export default config
