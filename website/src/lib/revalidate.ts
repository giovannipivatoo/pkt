import { revalidatePath } from 'next/cache'

/**
 * Coarse site-wide revalidation: header/footer render CMS content on every
 * page, so any content change invalidates the whole static tree.
 */
const revalidateSite = ({ context }: { context?: Record<string, unknown> }): void => {
  if (context?.disableRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Running outside a Next.js request (e.g. `payload run` seed script).
  }
}

export const revalidateAfterChange = ({ context }: { context: Record<string, unknown> }) => {
  revalidateSite({ context })
}

export const revalidateAfterDelete = ({ context }: { context: Record<string, unknown> }) => {
  revalidateSite({ context })
}
