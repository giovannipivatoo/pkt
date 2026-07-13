import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Post } from '../payload-types'

export function RichTextBody({ data }: { data: Post['body'] }) {
  return (
    <div className="richtext">
      <RichText data={data} />
    </div>
  )
}
