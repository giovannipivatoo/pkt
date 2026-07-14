import { withPayload } from '@payloadcms/next/withPayload'

// `npm run export` sets these to build a static, CMS-less snapshot for GitHub
// Pages (served under a repo subpath). The normal dev/build ignores them.
const isExport = process.env.NEXT_PUBLIC_EXPORT === '1'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport && {
    output: 'export',
    basePath,
    assetPrefix: basePath || undefined,
    images: { unoptimized: true },
    trailingSlash: true,
  }),
}

export default withPayload(nextConfig)
